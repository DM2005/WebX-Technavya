import mongoose from "mongoose";

const labSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    testTypes: {
      type: [String],
      enum: [
        "X-Ray",
        "Blood Test",
        "MRI",
        "CT Scan",
        "Ultrasound",
        "Urine Test",
        "ECG",
        "Cholesterol",
        "Diabetes",
        "Allergy",
      ],
      default: [],
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    averagePrice: {
      type: Number,
      default: 500, // Placeholder base price
    },
  },
  { timestamps: true }
);

labSchema.index({ location: "2dsphere" });

export const Lab = mongoose.model("Lab", labSchema);
