import mongoose from "mongoose";

const topicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  language: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Language',
    required: false,
  },
  icon: {
    type: String,
    default: '📝',
  },
  order: {
    type: Number,
    default: 0,
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner',
  },
}, {
  timestamps: true,
});

topicSchema.index({ language: 1, order: 1 });

export default mongoose.model("Topic", topicSchema);
