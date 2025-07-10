import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { logger } from './utils/logger';

dotenv.config();
const app = express();

const PORT = process.env.PORT;

app.get('/', (_: Request, response: Response) => {
  response.status(200).send('Hello World');
});

app
  .listen(PORT, () => {
    logger.info(`Server running at PORT: ${PORT}`);
  })
  .on('error', (error) => {
    throw new Error(error.message);
  });
