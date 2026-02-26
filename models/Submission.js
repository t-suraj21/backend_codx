import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  language: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Language',
    required: true,
  },
  status: {
    type: String,
    // BUG FIX: added 'Internal Error' and 'Exec Format Error' to match all
    // possible statuses returned by judge0Service after normalisation.
    enum: [
      'Accepted',
      'Wrong Answer',
      'Runtime Error',
      'Time Limit Exceeded',
      'Compilation Error',
      'Memory Limit Exceeded',
      'Internal Error',
      'Exec Format Error',
      'Pending',
      'Running',
    ],
    required: true,
  },
  passedTestCases: {
    type: Number,
    default: 0,
  },
  totalTestCases: {
    type: Number,
    required: true,
  },
  testCaseResults: [{
    input: String,
    expectedOutput: String,
    actualOutput: String,
    passed: Boolean,
    runtime: Number,
    memory: Number,
    error: String,
  }],
  runtime: {
    type: Number,
  },
  memory: {
    type: Number,
  },
  accuracy: {
    type: Number,
    default: 0,
  },
  attempts: {
    type: Number,
    default: 1,
  },
  isAccepted: {
    type: Boolean,
    default: false,
  },
  judge0Token: {
    type: String,
  },
}, {
  timestamps: true,
});

submissionSchema.index({ user: 1, question: 1, createdAt: -1 });
submissionSchema.index({ status: 1 });
submissionSchema.index({ isAccepted: 1 });

export default mongoose.model("Submission", submissionSchema);
