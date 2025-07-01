import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import taskRoutes from "./routes/tasks.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Use task routes
app.use("/tasks", taskRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
