import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },

    phone: {
      type: String,
      match: [/^[6-9]\d{9}$/, "Invalid Indian phone number"],
    },

    password: { type: String, required: true, minlength: 6 },

    role: {
      type: String,
      enum: [
        "doctor",
        "patient",
        "hospitalAdmin",
        "labAdmin",
        "assistant",
      ],
    },
    fcmToken: {
      type: String,
      default: null,
    },

    bloodPressure : {
      type : String,
      trim : true
    },
    heartRate : {
      type : String,
      trim : true
    },
    oxygenLevel : {
      type : String,
      trim : true
    },
    temperature : {
      type : String,
      trim : true
    },
    otp: {
      type: String,
      trim: true
    },
    otpExpiry: {
      type: Date,
      default: null,
    },

    vitalUpdated: {
      type: Boolean,
      default: false,
    },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
