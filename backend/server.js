const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const cron = require("node-cron");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const TaskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  deadline: { type: Date, required: true },
  reminderSent: { type: Boolean, default: false }, // Tracks 1-day reminder
  alertSent: { type: Boolean, default: false }, // Tracks 2-hour alert
});

const Task = mongoose.model("Task", TaskSchema);

// Create a Task
app.post("/tasks", async (req, res) => {
  try {
    const { text, deadline } = req.body;
    if (!text || !deadline) {
      return res.status(400).json({ message: "Task text and deadline are required" });
    }
    const localDeadline = new Date(deadline).toISOString();

    const task = new Task({ text, completed: false, deadline });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Error creating task", error });
  }
});

// Get all Tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error });
  }
});

// Update Task (Toggle Completion or Update Text)
app.put("/tasks/:id", async (req, res) => {
  try {
    const { text, completed } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (text !== undefined) task.text = text;
    if (completed !== undefined) task.completed = completed;

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error });
  }
});

// Delete a Task
app.delete("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error });
  }
});

// ====================== EMAIL REMINDER SYSTEM ======================

// Nodemailer Transporter (Use correct credentials from .env)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use App Password for security
  },
});

// Function to Send Email Alerts
const sendEmailAlert = async (email, taskText, message) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Task Reminder: ${taskText}`,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent: Reminder for "${taskText}"`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

// Cron Job to Check Deadlines Every 10 Minutes
cron.schedule("*/10 * * * *", async () => {
  console.log("🔍 Checking for upcoming task deadlines...");
  
  const now = new Date();
  const localNow = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
  const oneDayLater = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 1 day later
  const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours later

  try {
    const tasks = await Task.find({ completed: false });

    tasks.forEach(async (task) => {
      const taskDeadline = new Date(task.deadline);

      if (taskDeadline > now) {
        if (taskDeadline <= oneDayLater && !task.reminderSent) {
          await sendEmailAlert(
            process.env.RECEIVER_EMAIL,
            task.text,
            `🔔 Reminder: Your task "${task.text}" is due in 1 day!`
          );
          await Task.findByIdAndUpdate(task._id, { reminderSent: true }); // Mark 1-day reminder sent
        }
        if (taskDeadline <= twoHoursLater && !task.alertSent) {
          await sendEmailAlert(
            process.env.RECEIVER_EMAIL,
            task.text,
            `⚠️ Urgent: Your task "${task.text}" is due in 2 hours!`
          );
          await Task.findByIdAndUpdate(task._id, { alertSent: true }); // Mark 2-hour alert sent
        }
      }
    });

  } catch (error) {
    console.error("❌ Error checking deadlines:", error);
  }
});

console.log("✅ Email reminder system started!");

// ====================== START SERVER ======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
