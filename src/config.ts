import path from 'path';

const PORT = 3000;

const uploadsFolderName = 'uploads';
const uploadsFolderPath = path.resolve(__dirname, `../${uploadsFolderName}`);

export { PORT, uploadsFolderName, uploadsFolderPath };
