export type TaskStatus = "pending" | "in_progress" | "done";

export type NewTask = Pick<Task, "name">;

export type Task = {
  id: string;
  name: string;
  creationDate: Date;
  status: TaskStatus;
};
