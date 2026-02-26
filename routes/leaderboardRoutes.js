import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.get("/global", async (req, res) => {
  try {
    // BUG FIX: never return full user objects — exclude password and sensitive fields.
    const users = await User
      .find()
      .select('name email points accuracy totalSolved easySolved mediumSolved hardSolved streak rank avatar')
      .sort({ points: -1 })
      .limit(50)
      .lean();

    // Attach rank position
    const ranked = users.map((u, i) => ({ ...u, rank: i + 1 }));
    res.json({ success: true, users: ranked });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
