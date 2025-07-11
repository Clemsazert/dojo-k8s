import "./App.css";

import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import type { Task } from "./domains/task/model";
import { TaskList } from "./components/TasksList";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const fetchTasks = async (): Promise<Task[]> => {
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
  const [taskName, setTaskName] = useState("");
  const queryClient = useQueryClient();

  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
    select: (data: Task[]) =>
      [...data].sort(
        (a, b) =>
          new Date(b.creationDate).getTime() -
          new Date(a.creationDate).getTime(),
      ),
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
          setTaskName("");
        },
      });
    }
  };

  const generateRandomTaskName = () =>
    `Task-${Math.random().toString(36).substring(2, 8)}`;

  const createManyTimeout = useRef<number>(null);
  const [creatingMany, setCreatingMany] = useState(false);

  const handleCreateMany = () => {
    if (creatingMany) return;
    setCreatingMany(true);
    for (let i = 0; i < 10; i++) {
      mutation.mutate(generateRandomTaskName());
    }
    createManyTimeout.current = setTimeout(() => {
      setCreatingMany(false);
    }, 2000);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
      }}
    >
      <h2>Task Manager</h2>
      <div
        style={{
          width: "100%",
          background: "grey",
          boxShadow: "0 2px 8px #0001",
          borderRadius: 8,
          padding: 24,
          marginBottom: 32,
          marginTop: 8,
          textAlign: "left",
        }}
      >
        <p>This task manager allows you to create new tasks one by one.</p>
        <p>You must provide a task name in this case.</p>
        <p>You can also create 10 tasks at once.</p>
        <p>Tasks will be processed as soon as a worker is available.</p>
        <p>
          When the processing is finished, the task switches to status "done"
          and you can see its processing duration.
        </p>
      </div>
      <div
        style={{
          display: "flex",
          width: "100%",
          alignItems: "flex-start",
          gap: 32,
        }}
      >
        <div style={{ flex: 2 }}>
          {isLoading && <p>Loading tasks...</p>}
          {error && <p>Error loading tasks</p>}
          {tasks && <TaskList tasks={tasks} />}
        </div>
        <div style={{ flex: 1, maxWidth: 350 }}>
          <div
            style={{
              background: "grey",
              borderRadius: 8,
              padding: 8,
            }}
          >
            <h3>Create a new task</h3>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Task name"
              style={{
                marginBottom: 12,
                padding: 8,
                borderRadius: 4,
              }}
            />
            <button
              onClick={handleCreate}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 4,
                background: "#2563eb",
                color: "#fff",
                fontWeight: 600,
                border: "none",
                marginBottom: 8,
              }}
            >
              Create Task
            </button>
            <button
              onClick={handleCreateMany}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 4,
                background: "#22c55e",
                color: "#fff",
                fontWeight: 600,
                border: "none",
              }}
              disabled={creatingMany}
            >
              {creatingMany ? "Please wait..." : "Create 10 Tasks"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
