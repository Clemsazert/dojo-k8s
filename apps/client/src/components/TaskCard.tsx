import type { Task } from "../domains/task/model";
import { StatusBadge } from "./StatusBadge";

export const TaskCard = ({ task }: { task: Task }) => {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        background: "#fff",
        boxShadow: "0 2px 8px #0001",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <strong style={{ fontSize: "1.1em", color: "black" }}>
          {task.name}
        </strong>
        <StatusBadge status={task.status} />
      </div>
      <div style={{ fontSize: "0.95em", color: "#555" }}>
        Created: {new Date(task.creationDate).toLocaleString()}
      </div>
      {task.processingDuration && (
        <div style={{ fontSize: "0.95em", color: "#555" }}>
          Processed in {Math.round(task.processingDuration)}ms
        </div>
      )}
    </div>
  );
};
