import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    default: null,
  },
  provider: {
    type: String,
    enum: ['local', 'google', 'apple'],
    default: 'local',
  },
  providerId: {
    type: String,
    default: null,
  },
  avatar: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: '',
  },
  rank: {
    type: Number,
    default: 0,
  },
  totalSolved: {
    type: Number,
    default: 0,
  },
  easySolved: {
    type: Number,
    default: 0,
  },
  mediumSolved: {
    type: Number,
    default: 0,
  },
  hardSolved: {
    type: Number,
    default: 0,
  },
  accuracy: {
    type: Number,
    default: 0,
  },
  totalSubmissions: {
    type: Number,
    default: 0,
  },
  acceptedSubmissions: {
    type: Number,
    default: 0,
  },
  streak: {
    type: Number,
    default: 0,
  },
  maxStreak: {
    type: Number,
    default: 0,
  },
  lastSubmissionDate: {
    type: Date,
  },
  solvedQuestions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
  }],
  badges: [{
    name: String,
    icon: String,
    earnedAt: Date,
  }],
  isPremium: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ['student', 'instructor', 'admin'],
    default: 'student',
  },
}, {
  timestamps: true,
});

// Hash password before saving (skip if already hashed via OTP flow or social login)
userSchema.pre('save', async function () {
  if (!this.isModified('password') || this.$locals?.skipHash || !this.password) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.index({ rank: 1 });
userSchema.index({ accuracy: -1 });
userSchema.index({ totalSolved: -1 });

export default mongoose.model("User", userSchema);
