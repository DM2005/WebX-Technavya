import mongoose from "mongoose";

const medicineRecordSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,

    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,

    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,

    },
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },
    type: {
      type: String,
      enum: ['Consultation', 'Prescription', 'Lab Report', 'Surgery', 'Vaccination', 'Emergency', 'Checkup', 'Follow-up'],
      required: true,
      default: 'Consultation'
    },
    forPatientType: {
      type: String,
      enum: ["self", "family"],
      default: "self"
    },
    medicines: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
          maxlength: 100,
        },
        dosage: {
          type: String,
          required: true,
          trim: true,
          maxlength: 50,
        },
        frequency: {
          type: String,
          required: true,
          trim: true,
          maxlength: 50,
        },
        duration: {
          type: String,
          trim: true,
          maxlength: 50,
        },
        notes: {
          type: String,
          trim: true,
          maxlength: 300,
          default: "",
        },
      },
    ],
    prescribedAt: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);


export const MedicalRecord = mongoose.model(
  "MedicalRecord",
  medicineRecordSchema
);
