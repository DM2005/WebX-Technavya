import mongoose from "mongoose";

const familyMemberSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      min: 0,
      max: 120,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    relation: {
      type: String,
      required: true,
      trim: true,
    },
    medicalNotes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export const FamilyMember = mongoose.model("FamilyMember", familyMemberSchema);
