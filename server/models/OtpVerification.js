import mongoose from "mongoose";

const otpVerificationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  otp: {
    type: String, // store the hashed version
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true, // adds createdAt and updatedAt
});

const OtpVerification = mongoose.model("OtpVerification", otpVerificationSchema);

export default OtpVerification;
