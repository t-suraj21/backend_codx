import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
  },
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true,
  },
  companies: [{
    type: String,
  }],
  inputFormat: {
    type: String,
    required: true,
  },
  outputFormat: {
    type: String,
    required: true,
  },
  constraints: {
    type: String,
    required: true,
  },
  sampleTestCases: [{
    input: String,
    output: String,
    explanation: String,
  }],
  hiddenTestCases: [{
    input: String,
    output: String,
  }],
  starterCode: {
    python: String,
    cpp: String,
    c: String,
  },
  hints: [{
    type: String,
  }],
  tags: [{
    type: String,
  }],
  acceptanceRate: {
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
  likes: {
    type: Number,
    default: 0,
  },
  dislikes: {
    type: Number,
    default: 0,
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Number,
    default: 0,
  },
  isCompetition: {
    type: Boolean,
    default: false,
    index: true,
  },
  timeLimit: {
    // Minutes allowed in competition mode
    type: Number,
    default: null,
  },
  points: {
    type: Number,
    default: 10,
  },
}, {
  timestamps: true,
});

questionSchema.index({ topic: 1, difficulty: 1, order: 1 });
questionSchema.index({ tags: 1 });
questionSchema.index({ companies: 1 });
questionSchema.index({ isCompetition: 1, difficulty: 1 });

export default mongoose.model("Question", questionSchema);
