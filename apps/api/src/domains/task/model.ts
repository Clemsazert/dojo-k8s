export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

export type NewTask = Pick<Task, 'name'>;

export type Task = {
  id: string;
  name: string;
  creationDate: Date;
  status: TaskStatus;
};
