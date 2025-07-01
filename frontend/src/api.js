const API_URL = "http://localhost:5001/tasks";

// GET: Fetch all tasks from backend
export const getTasks = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch tasks");
    return await response.json();
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
};

// POST: Add a new task
export const addTask = async (task) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });

    if (!response.ok) throw new Error("Failed to add task");
    return await response.json();
  } catch (error) {
    console.error("Error adding task:", error);
    return null;
  }
};

// DELETE: Remove a task by ID
export const deleteTask = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

    if (!response.ok) throw new Error("Failed to delete task");
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};

// PUT: Update a task by ID (if needed)
export const updateTask = async (id, updatedTask) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask),
    });

    if (!response.ok) throw new Error("Failed to update task");
    return await response.json();
  } catch (error) {
    console.error("Error updating task:", error);
    return null;
  }
};
