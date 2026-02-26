import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  // Pending registration data (stored until OTP verified)
  name: { type: String, required: true },
  password: { type: String, required: true }, // already hashed
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    // Auto-delete document 10 min after expiry
    index: { expires: 0 },
  },
  attempts: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

otpSchema.index({ email: 1 });

export default mongoose.model("Otp", otpSchema);
