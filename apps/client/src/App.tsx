import "./App.css";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import type { Task } from "./domains/task/model";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const fetchTasks = async (): Promise<Task> => {
  return fetch(`${BACKEND_URL}/task`).then((res) => res.json());
};

const createTask = async (name: string): Promise<void> => {
  return fetch(`${BACKEND_URL}/task`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  }).then((res) => res.json());
};

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [taskName, setTaskName] = useState("");
  const queryClient = useQueryClient();

  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  const mutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleCreate = () => {
    if (taskName.trim()) {
      mutation.mutate(taskName, {
        onSuccess: () => {
          setModalOpen(false);
          setTaskName("");
        },
      });
    }
  };

  return (
    <div>
      <h2>Tasks</h2>
      <button onClick={() => setModalOpen(true)}>Create Task</button>
      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Create a new task</h3>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Task name"
            />
            <button onClick={handleCreate}>Create</button>
            <button onClick={() => setModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
      {isLoading && <p>Loading tasks...</p>}
      {error && <p>Error loading tasks</p>}
      {tasks && (
        <ul>
          {tasks.map((task: Task) => (
            <li key={task.id}>
              <strong>{task.name}</strong> - {task.status} -{" "}
              {new Date(task.creationDate).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
