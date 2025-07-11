import dotenv from 'dotenv';
import { createClient } from 'redis';

import { logger } from './utils/logger';
import { Task, TaskStatus } from './domains/task/model';

dotenv.config();

const REDIS_USER = process.env.REDIS_USER || 'default';
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || 'redispw';
const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = process.env.REDIS_PORT;

const POLLING_INTERVAL = 2000;

const redisClient = createClient({
  url: `redis://${REDIS_USER}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`,
});

redisClient.connect().catch(console.error);

async function processTaskQueue() {
  while (true) {
    const taskJson = await redisClient.lPop('tasks:list');
    if (taskJson) {
      const task: Task = JSON.parse(taskJson);
      logger.info(`Processing task: ${task.id} (${task.name})`);
      const duration = Math.floor(Math.random() * 4) + 1; // 1-4 seconds
      await new Promise((resolve) => setTimeout(resolve, duration * 1000));
      const finishedDate = new Date();
      task.status = TaskStatus.DONE;
      task.processingDuration = finishedDate.getTime() - new Date(task.creationDate).getTime();
      await redisClient.set(`task:${task.id}`, JSON.stringify(task));
      logger.info(
        `Task ${task.id} marked as DONE after ${duration}s (processingDuration: ${task.processingDuration}ms)`,
      );
    } else {
      await new Promise((resolve) => setTimeout(resolve, POLLING_INTERVAL));
    }
  }
}

processTaskQueue();
