import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { createClient } from 'redis';
import cors from 'cors';

import { logger } from './utils/logger';
import { listTasks, saveTask } from './domains/task/persistance';
import { Task, TaskStatus } from './domains/task/model';
import { randomUUID } from 'node:crypto';

dotenv.config();
const app = express();

const PORT = process.env.PORT;
const REDIS_USER = process.env.REDIS_USER || 'default';
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || 'redispw';
const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = process.env.REDIS_PORT;

const redisClient = createClient({
  url: `redis://${REDIS_USER}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`,
});

redisClient.connect().catch(logger.error);

app.use(express.json());
app.use(cors({ origin: '*' }));

app.use((req: Request, _, next) => {
  if (req.method === 'POST') {
    logger.info(`[${req.method}] ${req.url} - body: ${JSON.stringify(req.body)}`);
  } else {
    logger.info(`[${req.method}] ${req.url}`);
  }
  next();
});

app.get('/healthcheck', (_: Request, response: Response) => {
  response.status(200).json({ status: 'UP' });
});

app.get('/task', async (_: Request, response: Response) => {
  try {
    const tasks = await listTasks({ client: redisClient });
    response.status(200).json(tasks);
  } catch (error) {
    logger.error('Error retrieving tasks:', error);
    response.status(500).json({ error: 'Failed to retrieve tasks' });
  }
});

app.post('/task', async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Task name is required' });
    }
    const task: Task = {
      id: randomUUID(),
      creationDate: new Date(),
      status: TaskStatus.PENDING,
      name,
    };
    await saveTask({ client: redisClient, task });
    res.status(201).json(task);
  } catch (error) {
    logger.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

app
  .listen(PORT, () => {
    logger.info(`Server running at PORT: ${PORT}`);
  })
  .on('error', (error) => {
    throw new Error(error.message);
  });
