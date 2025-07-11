import type { Task } from "../domains/task/model";
import { TaskCard } from "./TaskCard";

export const TaskList = ({ tasks }: { tasks: Task[] }) => {
  return (
    <div>
      <h2>Tasks List</h2>
      {tasks.length !== 0 ? (
        tasks.map((task) => <TaskCard key={task.id} task={task} />)
      ) : (
        <>
          <p>No task to display.</p>
          <p>Create a new task to make it appear !</p>
        </>
      )}
    </div>
  );
};
