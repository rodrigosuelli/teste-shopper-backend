FROM node:20-alpine

# Create a non-root user and group to run the application
RUN addgroup app && adduser --system --ingroup app app

# set the user to run the app
USER app

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker’s cache
COPY package*.json ./

# Switch to root to change ownership of files
USER root

# Change the ownership of the /app directory to the app user
RUN chown -R app:app .

# Switch back to the non-root user
USER app

# Install dependencies
RUN npm install

# Copy the rest of the application code
# COPY . .

# Copy the rest of the application files and directories with read and write permissions to all of them
COPY --chown=app:app . .

# Build the project
RUN npm run build

# Install only production dependencies
# Use `npm install --omit=dev` to skip dev dependencies
# RUN npm install --omit=dev

# Expose the application port
EXPOSE 3000

# Set the command to run the application
# CMD ["npm", "run", "start"]
CMD ["npm", "run", "start:migrate:seed"]
