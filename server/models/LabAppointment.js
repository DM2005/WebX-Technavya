import mongoose from "mongoose";

const labAppointmentSchema = new mongoose.Schema(
  {
    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    forPatientType: {
      type: String,
      enum: ["self", "familyMember"],
      required: true,
    },
    labId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lab",
      required: true,
    },

    testDetails: {
      testName: {
        type: String,
        required: true,
        trim: true,
      },
      testType: {
        type: String,
        enum: ["Blood", "X-Ray", "MRI", "CT Scan", "Urine", "Other"],
        required: true,
      },
    },

    scheduledDate: {
      type: Date,
      required: true,
    },

    timeSlot: {
      type: String,
      required: true,
    },

    notes: {
      type: String,
      trim: true,
    },

    doctorReference: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },

    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Pending",
    },

    issuedAt: {
      type: Date,
      default: Date.now,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
    reportPDF: {
    type: String, // this will store Cloudinary PDF URL
    required: false,
    trim  : true,
  },
  },
  { timestamps: true }
);

export const LabAppointment = mongoose.model("LabAppointment", labAppointmentSchema);
