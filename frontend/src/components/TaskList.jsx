import TaskItem from "./TaskItem";

const TaskList = ({ tasks, toggleComplete, removeTask }) => {
  return (
    <div className="p-4">
      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks available.</p>
      ) : (
        tasks.map((task, index) => (
          <TaskItem key={index} task={task} index={index} toggleComplete={toggleComplete} removeTask={removeTask} />
        ))
      )}
    </div>
  );
};

export default TaskList;
