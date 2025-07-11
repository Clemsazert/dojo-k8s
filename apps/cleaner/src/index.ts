import dotenv from 'dotenv';
import { createClient } from 'redis';

import { logger } from './utils/logger';
import { Task, TaskStatus } from './domains/task/model';

dotenv.config();

const REDIS_USER = process.env.REDIS_USER || 'default';
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || 'redispw';
const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = process.env.REDIS_PORT;

const redisClient = createClient({
  url: `redis://${REDIS_USER}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`,
});

redisClient
  .connect()
  .then(async () => {
    const keys = await redisClient.keys('task:*');
    let deletedTaskCount = 0;
    for (const key of keys) {
      const value = await redisClient.get(key);
      if (value) {
        const task: Task = JSON.parse(value);
        if (task.status === TaskStatus.DONE) {
          await redisClient.del(key);
          logger.info(`Deleted task ${task.id} with status DONE`);
          deletedTaskCount += 1;
        }
      }
    }
    logger.info(`Deletion complete. Removed ${deletedTaskCount} tasks with status DONE`);
    process.exit();
  })
  .catch((err) => {
    logger.error(err);
    process.exit();
  });
