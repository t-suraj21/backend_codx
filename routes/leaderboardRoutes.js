import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.get("/global", async (req, res) => {
  try {
    const users = await User.find().sort({ points: -1 }).limit(50);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
