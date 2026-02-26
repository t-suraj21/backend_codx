import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import topicRoutes from "./routes/topicRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import codeRoutes from "./routes/codeRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import batchRoutes from "./routes/batchRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import languageRoutes from "./routes/languageRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check — Render uses this to confirm service is alive
app.get("/health", (req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));

app.use("/api/auth", authRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/code", codeRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/batches", batchRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/languages", languageRoutes);

export default app;
