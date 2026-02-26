import mongoose from 'mongoose';

const languageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  judge0Id: {
    type: Number,
    required: true,
  },
  icon: {
    type: String,
    default: '💻',
  },
  extension: {
    type: String,
    required: true,
  },
  template: {
    type: String,
    default: '',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Language', languageSchema);
