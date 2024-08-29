import path from 'path';

const PORT = 3000;

const uploadsFolderName = 'uploads';

// In production we are inside dist folder
const uploadsFolderPath =
  process.env.NODE_ENV === 'production'
    ? path.resolve(__dirname, `../../${uploadsFolderName}`)
    : path.resolve(__dirname, `../${uploadsFolderName}`);

export { PORT, uploadsFolderName, uploadsFolderPath };
