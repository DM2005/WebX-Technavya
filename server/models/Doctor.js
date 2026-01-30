import mongoose from "mongoose";


const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    specialization: {
      type: String,
      required: true,
      trim: true,
    },
    experience: {
      type: Number,
      min: 0,
      max: 60,
    },
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
    },
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    education: {
      type: String,
    },
    consultationFee: {
      type: Number,
      required: true,
      default: 1
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalReviews: {
      type: Number,
      default: 0
    },
  },
  { timestamps: true }
);

export const Doctor = mongoose.model("Doctor", doctorSchema);
