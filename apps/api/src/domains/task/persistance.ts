import { createClient } from 'redis';
import { Task } from './model';

export const saveTask = async ({ client, task }: { client: ReturnType<typeof createClient>; task: Task }) => {
  await client.set(`task:${task.id}`, JSON.stringify(task));
  await client.rPush('tasks:list', JSON.stringify(task));
};

export const listTasks = async ({ client }: { client: ReturnType<typeof createClient> }): Promise<Task[]> => {
  const keys = await client.keys('task:*');
  const tasks: Task[] = [];
  for (const key of keys) {
    const value = await client.get(key);
    if (value) {
      const task: Task = JSON.parse(value);
      task.creationDate = new Date(task.creationDate);
      tasks.push(task);
    }
  }
  return tasks;
};
