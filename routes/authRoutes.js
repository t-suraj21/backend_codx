import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Otp from "../models/Otp.js";
import { sendOtpEmail } from "../services/emailService.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

/**
 * @route   POST /api/auth/send-otp
 * @desc    Validate registration fields and send OTP to email
 * @access  Public
 */
router.post("/send-otp", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email address" });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    // Check email not already registered
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    // Hash the password now so we don't store plaintext in OTP doc
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Upsert: replace any previous OTP for this email
    await Otp.findOneAndUpdate(
      { email: email.toLowerCase() },
      { name, email: email.toLowerCase(), password: hashedPassword, otp, expiresAt, attempts: 0 },
      { upsert: true, new: true }
    );

    await sendOtpEmail(email, otp);

    res.json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP", error: error.message });
  }
});

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Verify OTP and create the user account
 * @access  Public
 */
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    const record = await Otp.findOne({ email: email.toLowerCase() });

    if (!record) {
      return res.status(400).json({ success: false, message: "OTP not found. Please request a new one." });
    }

    // Check expiry
    if (record.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: record._id });
      return res.status(400).json({ success: false, message: "OTP expired. Please request a new one." });
    }

    // Max 5 attempts
    if (record.attempts >= 5) {
      await Otp.deleteOne({ _id: record._id });
      return res.status(400).json({ success: false, message: "Too many failed attempts. Please request a new OTP." });
    }

    if (record.otp !== otp.toString().trim()) {
      await Otp.updateOne({ _id: record._id }, { $inc: { attempts: 1 } });
      const remaining = 5 - (record.attempts + 1);
      return res.status(400).json({ success: false, message: `Incorrect OTP. ${remaining} attempts remaining.` });
    }

    // OTP correct — create user (password already hashed)
    const user = new User({
      name: record.name,
      email: record.email,
      password: record.password,
    });
    // Skip the pre-save hashing since password is already hashed
    user.$locals.skipHash = true;
    await user.save();

    // Clean up OTP record
    await Otp.deleteOne({ _id: record._id });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret", { expiresIn: "30d" });

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        points: user.points || 0,
        accuracy: user.accuracy || 0,
      },
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ success: false, message: "Verification failed", error: error.message });
  }
});

/**
 * @route   POST /api/auth/social
 * @desc    Sign in or sign up via Google / Apple
 * @access  Public
 * @body    { provider: 'google'|'apple', email, name, providerId }
 */
router.post("/social", async (req, res) => {
  try {
    const { provider, email, name, providerId } = req.body;

    if (!provider || !email || !providerId) {
      return res.status(400).json({ success: false, message: "provider, email and providerId are required" });
    }

    let user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      // Existing account — update provider info if it was a local account
      if (user.provider === 'local') {
        user.provider = provider;
        user.providerId = providerId;
        await user.save();
      }
    } else {
      // New account via social
      user = await User.create({
        name: name || email.split('@')[0],
        email: email.toLowerCase(),
        password: null,
        provider,
        providerId,
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret", { expiresIn: "30d" });

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        provider: user.provider,
        points: user.points || 0,
        accuracy: user.accuracy || 0,
        totalSolved: user.totalSolved || 0,
        easySolved: user.easySolved || 0,
        mediumSolved: user.mediumSolved || 0,
        hardSolved: user.hardSolved || 0,
        streak: user.streak || 0,
        rank: user.rank || 0,
      },
    });
  } catch (error) {
    console.error("Social auth error:", error);
    res.status(500).json({ success: false, message: "Social authentication failed", error: error.message });
  }
});

/**
 * @route   POST /api/auth/register  (kept for compatibility)
 * @desc    Register new user (direct, no OTP — used internally)
 * @access  Public
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    // BUG FIX: normalise email to lowercase so the same address can't register twice
    // with different capitalisation (e.g. User@Gmail.com vs user@gmail.com).
    const emailNorm = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: emailNorm });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }
    const user = await User.create({ name: name.trim(), email: emailNorm, password });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret", { expiresIn: "30d" });
    res.status(201).json({ token, user: { _id: user._id, name: user.name, email: user.email, points: 0, accuracy: 0 } });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(400).json({ error: "User not found" });

    // Social-only accounts don't have a password
    if (!user.password) {
      const providerName = user.provider === 'google' ? 'Google' : user.provider === 'apple' ? 'Apple' : 'a social provider';
      return res.status(400).json({
        error: `This account was created with ${providerName}. Please use the "Continue with ${providerName === 'a social provider' ? 'social login' : providerName}" button instead.`
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Wrong password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret");

    // Remove password from response
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      points: user.points,
      accuracy: user.accuracy,
    };

    res.json({ token, user: userResponse });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   GET /api/auth/profile
 * @desc    Get logged-in user's profile (used on app restart to restore session)
 * @access  Private
 */
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const u = req.user;
    res.json({
      success: true,
      user: {
        _id: u._id,
        name: u.name,
        email: u.email,
        avatar: u.avatar || '',
        bio: u.bio || '',
        provider: u.provider || 'local',
        role: u.role || 'student',
        isPremium: u.isPremium || false,
        points: u.points || 0,
        rank: u.rank || 0,
        totalSolved: u.totalSolved || 0,
        easySolved: u.easySolved || 0,
        mediumSolved: u.mediumSolved || 0,
        hardSolved: u.hardSolved || 0,
        accuracy: u.accuracy || 0,
        streak: u.streak || 0,
        maxStreak: u.maxStreak || 0,
        totalSubmissions: u.totalSubmissions || 0,
        acceptedSubmissions: u.acceptedSubmissions || 0,
        badges: u.badges || [],
      },
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch profile" });
  }
});

export default router;
