import express from "express";
import Question from "../models/Question.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/questions?topic=<id>   — by topic
router.get("/", async (req, res) => {
  try {
    const { topic } = req.query;
    const questions = await Question.find({ topic }).sort({ order: 1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/questions/competition?difficulty=Easy|Medium|Hard
// Returns all competition-flagged questions
router.get("/competition", async (req, res) => {
  try {
    const { difficulty } = req.query;
    const filter = { isCompetition: true };
    if (difficulty && ['Easy', 'Medium', 'Hard'].includes(difficulty)) {
      filter.difficulty = difficulty;
    }
    const questions = await Question
      .find(filter)
      .populate('topic', 'name')
      .sort({ difficulty: 1, order: 1 })
      .select('title difficulty topic tags companies acceptanceRate totalSubmissions points timeLimit isCompetition');
    res.json({ success: true, questions });
  } catch (error) {
    console.error('Competition questions error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/questions/:id  — single question detail
router.get("/:id", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate('topic', 'name');
    if (!question) return res.status(404).json({ error: 'Question not found' });
    res.json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
