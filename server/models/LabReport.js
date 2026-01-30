import mongoose from "mongoose";

const labReportSchema = new mongoose.Schema(
    {
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            // Ref can be Patient or FamilyMember, so we typically omit explicit ref or use dynamic ref if needed.
            // Since it stores IDs from two different collections, we can verify existence manually or use `refPath`.
            // For simplicity matching the controller, we'll store as ObjectId.
        },
        forPatientType: {
            type: String,
            enum: ["Patient", "FamilyMember"],
            required: true,
        },
        labId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lab", // Assuming Lab model exists, otherwise generic ObjectId
            required: true,
        },
        testName: {
            type: String,
            required: true,
            trim: true,
        },
        testType: {
            type: String,
            required: true,
            trim: true,
        },
        result: {
            type: String, // Result can be text or number
            required: true,
        },
        normalRange: {
            type: String,
            trim: true,
        },
        unit: {
            type: String,
            trim: true,
        },
        diagnosis: {
            type: String,
            trim: true,
        },
        doctorReference: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
        },
    },
    { timestamps: true }
);

export const LabReport = mongoose.model("LabReport", labReportSchema);
