import { useState } from "react";

const TaskForm = ({ addTask }) => {
  const [task, setTask] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task.trim()) return;
    addTask(task);
    setTask("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4">
      <input
        type="text"
        className="border p-2 rounded w-full"
        placeholder="Enter a task..."
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <button className="bg-blue-500 text-white px-4 py-2 rounded">Add</button>
    </form>
  );
};

export default TaskForm;
