import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  deadline: { type: Date }, // Made optional
});

const Task = mongoose.model("Task", taskSchema);
export default Task;
