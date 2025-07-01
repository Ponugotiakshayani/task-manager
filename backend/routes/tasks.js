import express from "express";
import Task from "../models/Task.js";

const router = express.Router();

// GET all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find(); // Fetch all tasks
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error });
  }
});

// POST (Create a new task)
router.post("/", async (req, res) => {
  try {
    const { title, deadline } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const newTask = new Task({
      title,
      completed: false,
      deadline: deadline ? new Date(deadline) : null, // Set deadline if provided
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: "Error adding task", error });
  }
});

// UPDATE a task (edit title or mark as completed)
router.put("/:id", async (req, res) => {
  try {
    const { title, completed, deadline } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title, completed, deadline: deadline ? new Date(deadline) : undefined },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error });
  }
});

// DELETE a task
router.delete("/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error });
  }
});

export default router;
