import type { TaskStatus } from "../domains/task/model";

const getStatusBadgeColor = (status: TaskStatus) => {
  switch (status) {
    case "pending":
      return "#facc15";
    case "in_progress":
      return "#38bdf8";
    case "done":
      return "#22c55e";
    default:
      return "#e5e7eb";
  }
};

export const StatusBadge = ({ status }: { status: TaskStatus }) => {
  return (
    <span
      style={{
        background: getStatusBadgeColor(status),
        color: "#222",
        borderRadius: "0.5em",
        padding: "0.2em 0.7em",
        fontWeight: 600,
        fontSize: "0.9em",
        marginLeft: 8,
      }}
    >
      {status}
    </span>
  );
};
