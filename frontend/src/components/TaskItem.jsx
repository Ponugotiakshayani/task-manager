const TaskItem = ({ task, index, toggleComplete, removeTask }) => {
    return (
      <div className="flex justify-between items-center bg-gray-100 p-2 my-2 rounded">
        <span
          className={`cursor-pointer ${task.completed ? "line-through text-gray-500" : ""}`}
          onClick={() => toggleComplete(index)}
        >
          {task.text}
        </span>
        <button
          onClick={() => removeTask(index)}
          className="bg-red-500 text-white px-2 py-1 rounded"
        >
          Delete
        </button>
      </div>
    );
  };
  
  export default TaskItem;
  