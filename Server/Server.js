import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import resourceRoutes from "./Routes/resourceRoutes.js";
import subjectRoutes from "./Routes/subjectRoutes.js";
import noteRoutes from "./Routes/noteRoutes.js";
import interviewRoutes from "./Routes/interviewRoutes.js";
import jobRoutes from "./Routes/jobRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/resources", resourceRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/jobs", jobRoutes);

// Static uploads folder
app.use("/uploads", express.static("uploads"));

// Home route
app.get("/", (req, res) => {
  res.send("FocusHive API Running...");
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("MongoDB Connection Error ❌", err));

// Start server if not running in a Vercel serverless environment
// (Render and local development will both run this block)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
}

// Export for Vercel serverless
export default app;