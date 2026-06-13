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

// 🔥 FIXED: DB connect FIRST then server start
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected ✅");

    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });

  } catch (err) {
    console.log("MongoDB Connection Error ❌", err);
  }
};

startServer();