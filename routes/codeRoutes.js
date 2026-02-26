import express from "express";
import judge0Service from '../services/judge0Service.js';
import Question from "../models/Question.js";
import Submission from "../models/Submission.js";
import User from "../models/User.js";
import Language from '../models/Language.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { codeSubmissionValidation, validate } from '../middleware/validation.js';
import { codeExecutionLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

/**
 * @route   POST /api/code/run
 * @desc    Run code with test cases (not saved)
 * @access  Private
 */
router.post('/run', authMiddleware, codeExecutionLimiter, codeSubmissionValidation, validate, async (req, res) => {
  try {
    const { code, language, questionId } = req.body;

    // Get question with test cases
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    // Use only sample test cases for "Run"
    const testCases = question.sampleTestCases.map(tc => ({
      input: tc.input,
      output: tc.output,
    }));

    // Execute code with Judge0
    const result = await judge0Service.runTestCases(code, language, testCases);

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Run code error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Code execution failed', 
      error: error.message 
    });
  }
});

/**
 * @route   POST /api/code/submit
 * @desc    Submit code and save result (uses all test cases)
 * @access  Private
 */
router.post('/submit', authMiddleware, codeExecutionLimiter, codeSubmissionValidation, validate, async (req, res) => {
  try {
    const { code, language, questionId } = req.body;
    const userId = req.user._id;

    // Get question with all test cases
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    // Get language object
    const languageObj = await Language.findOne({ code: language });
    if (!languageObj) {
      return res.status(400).json({ success: false, message: 'Invalid language' });
    }

    // Combine sample and hidden test cases
    const allTestCases = [
      ...question.sampleTestCases.map(tc => ({ input: tc.input, output: tc.output })),
      ...question.hiddenTestCases,
    ];

    // Execute code with Judge0
    const result = await judge0Service.runTestCases(code, language, allTestCases);

    // Check if user already solved this question
    // BUG FIX: solvedQuestions stores ObjectIds; must use .toString() comparison
    // because req.body.questionId is a plain string — .includes() always returned false.
    const user = await User.findById(userId);
    const alreadySolved = user.solvedQuestions.some(
      id => id.toString() === questionId.toString()
    );

    // Create submission record
    const submission = await Submission.create({
      user: userId,
      question: questionId,
      code: code,
      language: languageObj._id,
      status: result.status,
      passedTestCases: result.passedTestCases,
      totalTestCases: result.totalTestCases,
      testCaseResults: result.testCaseResults,
      runtime: result.runtime,
      memory: result.memory,
      accuracy: result.accuracy,
      isAccepted: result.status === 'Accepted',
    });

    // Update user statistics
    user.totalSubmissions += 1;
    const now = new Date();
    const lastSubmission = user.lastSubmissionDate;

    // Update streak
    // BUG FIX: daysDiff === 0 means same-day resubmit — do nothing (streak already counted).
    // daysDiff === 1 → consecutive day → increment.
    // daysDiff > 1  → gap → reset to 1.
    if (lastSubmission) {
      const daysDiff = Math.floor((now - lastSubmission) / (1000 * 60 * 60 * 24));
      if (daysDiff === 1) {
        user.streak += 1;
        user.maxStreak = Math.max(user.maxStreak, user.streak);
      } else if (daysDiff > 1) {
        user.streak = 1;
        user.maxStreak = Math.max(user.maxStreak, user.streak);
      }
      // daysDiff === 0: same day, streak unchanged
    } else {
      user.streak = 1;
      user.maxStreak = Math.max(user.maxStreak || 0, 1);
    }
    user.lastSubmissionDate = now;

    // If accepted and not already solved
    if (result.status === 'Accepted' && !alreadySolved) {
      user.acceptedSubmissions += 1;
      user.totalSolved += 1;
      user.solvedQuestions.push(questionId);

      // Update difficulty-wise count
      if (question.difficulty === 'Easy') {
        user.easySolved += 1;
      } else if (question.difficulty === 'Medium') {
        user.mediumSolved += 1;
      } else if (question.difficulty === 'Hard') {
        user.hardSolved += 1;
      }

      // Award badges
      if (user.totalSolved === 1) {
        user.badges.push({ name: 'First Solve', icon: '🎉', earnedAt: now });
      }
      if (user.totalSolved === 10) {
        user.badges.push({ name: 'Problem Solver', icon: '💪', earnedAt: now });
      }
      if (user.totalSolved === 50) {
        user.badges.push({ name: 'Expert Coder', icon: '🏆', earnedAt: now });
      }
      if (user.streak === 7) {
        user.badges.push({ name: '7-Day Streak', icon: '🔥', earnedAt: now });
      }
    }

    // Update question statistics
    question.totalSubmissions += 1;
    if (result.status === 'Accepted') {
      question.acceptedSubmissions += 1;
    }
    question.acceptanceRate = (question.acceptedSubmissions / question.totalSubmissions) * 100;
    await question.save();

    // Recalculate user accuracy
    user.accuracy = user.totalSubmissions > 0 
      ? (user.acceptedSubmissions / user.totalSubmissions) * 100 
      : 0;

    await user.save();

    res.json({
      success: true,
      submission: {
        _id: submission._id,
        status: submission.status,
        passedTestCases: submission.passedTestCases,
        totalTestCases: submission.totalTestCases,
        accuracy: submission.accuracy,
        runtime: submission.runtime,
        memory: submission.memory,
        testCaseResults: submission.testCaseResults,
      },
      userStats: {
        totalSolved: user.totalSolved,
        easySolved: user.easySolved,
        mediumSolved: user.mediumSolved,
        hardSolved: user.hardSolved,
        accuracy: user.accuracy,
        streak: user.streak,
        newBadges: user.badges.slice(-1),
      },
    });
  } catch (error) {
    console.error('Submit code error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Submission failed', 
      error: error.message 
    });
  }
});

/**
 * @route   GET /api/code/languages
 * @desc    Get all supported languages
 * @access  Public
 */
router.get('/languages', async (req, res) => {
  try {
    const languages = await Language.find({ isActive: true })
      .select('name code judge0Id icon extension template');
    
    res.json({
      success: true,
      languages,
    });
  } catch (error) {
    console.error('Get languages error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch languages' });
  }
});

export default router;
