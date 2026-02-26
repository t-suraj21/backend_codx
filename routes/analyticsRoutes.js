import express from 'express';
import User from '../models/User.js';
import Submission from '../models/Submission.js';
import Topic from '../models/Topic.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// ─── Helper: calculate current daily streak from submission dates ────────────
function calcStreak(submissions) {
  if (!submissions.length) return 0;

  // Build a set of unique date strings "YYYY-MM-DD" when user had ≥1 submission
  const dateSet = new Set(
    submissions.map(s => new Date(s.createdAt).toDateString())
  );

  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    if (dateSet.has(d.toDateString())) {
      streak++;
    } else if (i > 0) {
      // Gap — streak broken
      break;
    }
  }
  return streak;
}

// ─── Helper: format how long ago a date was ─────────────────────────────────
function timeAgo(date) {
  const diffMs = Date.now() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1)  return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24)  return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 7)  return `${diffDays}d ago`;
  return new Date(date).toLocaleDateString();
}

// GET /api/analytics
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // All user submissions, newest first, populate question + topic + language
    const submissions = await Submission.find({ user: userId })
      .populate({
        path: 'question',
        select: 'title difficulty topic points',
        populate: { path: 'topic', select: 'name' },
      })
      // BUG FIX: language was not populated — it showed as an ObjectId string in recentSubmissions.
      .populate('language', 'name code')
      .sort({ createdAt: -1 });

    // ── Difficulty breakdown (count distinct accepted problems) ──────────────
    const acceptedMap = {}; // questionId → difficulty
    submissions.forEach(sub => {
      if (sub.isAccepted && sub.question) {
        const qid = sub.question._id.toString();
        if (!acceptedMap[qid]) {
          acceptedMap[qid] = (sub.question.difficulty || 'Easy').toLowerCase();
        }
      }
    });
    const difficultyStats = { easy: 0, medium: 0, hard: 0 };
    Object.values(acceptedMap).forEach(d => {
      if (d === 'easy')   difficultyStats.easy++;
      else if (d === 'medium') difficultyStats.medium++;
      else if (d === 'hard')   difficultyStats.hard++;
    });
    const totalSolved = Object.keys(acceptedMap).length;

    // ── Overall accuracy ──────────────────────────────────────────────────────
    const overallAccuracy = submissions.length > 0
      ? Math.round(submissions.reduce((s, sub) => s + (sub.accuracy || 0), 0) / submissions.length)
      : 0;

    // ── Streak ───────────────────────────────────────────────────────────────
    const currentStreak = calcStreak(submissions);

    // ── Weekly activity (last 7 days accuracy per day) ───────────────────────
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weekSubs = submissions.filter(s => new Date(s.createdAt) >= weekAgo);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const daySubs = weekSubs.filter(s => new Date(s.createdAt).toDateString() === d.toDateString());
      weekData.push({
        day: days[d.getDay()],
        accuracy: daySubs.length
          ? Math.round(daySubs.reduce((s, sub) => s + (sub.accuracy || 0), 0) / daySubs.length)
          : 0,
        count: daySubs.length,
      });
    }

    // ── Recent submissions (last 10) ─────────────────────────────────────────
    const recentSubmissions = submissions.slice(0, 10).map(sub => ({
      id: sub._id,
      questionTitle: sub.question?.title || 'Unknown',
      difficulty: sub.question?.difficulty || 'Unknown',
      status: sub.isAccepted ? 'Accepted' : (sub.status || 'Wrong Answer'),
      accuracy: sub.accuracy || 0,
      language: sub.language?.name || sub.language?.code || 'Unknown',
      timeAgo: timeAgo(sub.createdAt),
      date: sub.createdAt,
    }));

    // ── Weak topics (topics with lowest accuracy across submissions) ──────────
    const topicStats = {}; // topicId → { name, total, sumAccuracy }
    submissions.forEach(sub => {
      if (sub.question?.topic) {
        const tid = sub.question.topic._id?.toString() || sub.question.topic.toString();
        const tname = sub.question.topic.name || 'Unknown';
        if (!topicStats[tid]) topicStats[tid] = { name: tname, total: 0, sumAccuracy: 0 };
        topicStats[tid].total++;
        topicStats[tid].sumAccuracy += (sub.accuracy || 0);
      }
    });
    const weakTopics = Object.values(topicStats)
      .filter(t => t.total >= 1)
      .map(t => ({ name: t.name, accuracy: Math.round(t.sumAccuracy / t.total), attempted: t.total }))
      .sort((a, b) => a.accuracy - b.accuracy) // lowest accuracy first
      .slice(0, 5);

    res.json({
      user: {
        name: user.name,
        email: user.email,
        points: user.points || 0,
        accuracy: user.accuracy || 0,
      },
      stats: {
        totalSolved,
        easy: difficultyStats.easy,
        medium: difficultyStats.medium,
        hard: difficultyStats.hard,
        overallAccuracy,
        totalPoints: user.points || 0,
        currentStreak,
      },
      weekData,
      recentSubmissions,
      weakTopics,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

export default router;
