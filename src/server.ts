import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import router from './routes';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json()); // required to parse json body from incoming requests

app.use('/', router);

app.listen(port, () => {
  console.log(`Express.js server listening on port ${port}`);
});
