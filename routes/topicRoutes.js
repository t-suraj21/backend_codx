import express from "express";
import Topic from "../models/Topic.js";
import Question from "../models/Question.js";

const router = express.Router();

// Get all topics with question counts
router.get("/", async (req, res) => {
  try {
    const topics = await Topic.find().sort({ order: 1 }).lean();
    const counts = await Question.aggregate([
      { $group: { _id: '$topic', count: { $sum: 1 } } }
    ]);
    const countMap = {};
    counts.forEach(c => { countMap[String(c._id)] = c.count; });
    const topicsWithCount = topics.map(t => ({
      ...t,
      questions: Array(countMap[String(t._id)] || 0).fill(null),
    }));
    res.json(topicsWithCount);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single topic by ID with questions
router.get("/:id", async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);
    
    if (!topic) {
      return res.status(404).json({ 
        success: false, 
        message: "Topic not found" 
      });
    }

    // Get questions for this topic
    const questions = await Question.find({ topic: req.params.id })
      .select('title difficulty order acceptanceRate totalSubmissions')
      .sort({ order: 1 });

    res.json({
      success: true,
      topic: topic,
      questions: questions,
      questionCount: questions.length
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid topic ID" 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

export default router;
