import { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash, FaCheck, FaEdit, FaPlus, FaClock } from "react-icons/fa";

const API_URL = "http://localhost:5001/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [editedDeadline, setEditedDeadline] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

  // Fetch tasks from backend
  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => setTasks(response.data))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  // Format deadline to local time
  const formatLocalTime = (isoString) => {
    return new Date(isoString).toLocaleString();
  };

  // Function to add a new task
  const addTask = () => {
    if (!newTask.trim() || !newDeadline || !newDescription.trim()) {
      alert("Please fill all fields!");
      return;
    }

    // Check if task with the same name exists
    if (tasks.some((task) => task.text.toLowerCase() === newTask.toLowerCase())) {
      alert("It already exists, try to give another name.");
      return;
    }

    const taskData = {
      text: newTask,
      completed: false,
      deadline: newDeadline,
      description: newDescription,
    };

    axios
      .post(API_URL, taskData)
      .then((response) => {
        setTasks([...tasks, response.data]);
        setNewTask("");
        setNewDeadline("");
        setNewDescription("");
      })
      .catch((error) => console.error("Error adding task:", error));
  };

  // Function to toggle completion status
  const toggleTaskCompletion = (id, completed) => {
    axios
      .put(`${API_URL}/${id}`, { completed: !completed })
      .then((response) => {
        setTasks(tasks.map((task) => (task._id === id ? response.data : task)));
      })
      .catch((error) => console.error("Error updating task:", error));
  };

  // Function to delete a task
  const deleteTask = (id) => {
    axios
      .delete(`${API_URL}/${id}`)
      .then(() => {
        setTasks(tasks.filter((task) => task._id !== id));
      })
      .catch((error) => console.error("Error deleting task:", error));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-700 text-center mb-4">
          Task Manager
        </h1>

        {/* Task Input Section */}
        <div className="flex flex-col space-y-4 mb-6">
          <div className="flex flex-col">
            <label className="font-semibold">Task Name:</label>
            <input
              type="text"
              placeholder="Enter task name..."
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold">Deadline:</label>
            <input
              type="datetime-local"
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={newDeadline}
              onChange={(e) => setNewDeadline(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold">Task Description:</label>
            <textarea
              placeholder="Enter task description..."
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              rows="4"
              maxLength="200"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
          </div>

          <button
            onClick={addTask}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center"
          >
            <FaPlus className="mr-1" /> Add Task
          </button>
        </div>

        {/* Completed Tasks Section */}
        <h2 className="text-lg font-bold text-green-600 mt-4">✔️ Completed Tasks</h2>
        <ul className="space-y-2">
          {tasks.filter((task) => task.completed).map((task) => (
            <li
              key={task._id}
              className="flex flex-col p-3 rounded-lg bg-green-100 transition"
            >
              <span className="line-through text-gray-500 font-semibold">
                {task.text}
              </span>
              <span className="text-gray-700">{task.description}</span>
              <span className="text-gray-500">
                <FaClock className="inline mr-1" /> {formatLocalTime(task.deadline)}
              </span>
              <div className="flex space-x-3 mt-2">
                <button
                  onClick={() => deleteTask(task._id)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <FaTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Pending Tasks Section */}
        <h2 className="text-lg font-bold text-yellow-600 mt-4">⏳ Pending Tasks</h2>
        <ul className="space-y-2">
          {tasks.filter((task) => !task.completed).map((task) => (
            <li
              key={task._id}
              className="flex flex-col p-3 rounded-lg bg-gray-200 transition"
            >
              <span className="text-gray-700 font-semibold">{task.text}</span>
              <span className="text-gray-700">{task.description}</span>
              <span className="text-gray-500">
                <FaClock className="inline mr-1" /> {formatLocalTime(task.deadline)}
              </span>
              <div className="flex space-x-3 mt-2">
                <button
                  onClick={() => toggleTaskCompletion(task._id, task.completed)}
                  className="p-2 rounded-full bg-yellow-500 text-white"
                >
                  <FaCheck />
                </button>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <FaTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
