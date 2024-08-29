import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import router from './routes';
import { PORT, uploadsFolderName, uploadsFolderPath } from './config';

const app = express();

app.use(cors());

app.use(`/${uploadsFolderName}`, express.static(uploadsFolderPath));

app.use(express.json({ limit: '2mb' })); // required to parse json body from incoming requests

app.use('/', router);

app.listen(PORT, () => {
  console.log(`Starting Express.js server...`);
  console.log(`Uploads folder path: ${uploadsFolderPath}`);
  console.log(`process.env.NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`process.env.DATABASE_URL: ${process.env.DATABASE_URL}`);
  console.log(`process.env.GEMINI_API_KEY: ${process.env.GEMINI_API_KEY}`);
  console.log(`Express.js server listening on PORT ${PORT}`);
});
