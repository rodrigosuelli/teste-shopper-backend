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
  console.log(`Express.js server listening on PORT ${PORT}`);
  console.log(`Uploads folder path: ${uploadsFolderPath}`);
});
