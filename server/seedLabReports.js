import mongoose from "mongoose";
import dotenv from "dotenv";
import { LabReport } from "./models/LabReport.js";
import { Patient } from "./models/Patient.js";
import { Lab } from "./models/Lab.js";
import User from "./models/User.js";

dotenv.config();

const seedLabReports = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        // Clear existing reports (optional, comment out if you want to keep them)
        // await LabReport.deleteMany({});
        // console.log("Cleared existing lab reports");

        // Multi-criteria search for the patient
        // 1. Try to find by User email "krrish@gmail.com"
        // 2. Fallback to any patient
        let user = await User.findOne({ email: "krrish@gmail.com" });
        let patient;

        if (user) {
            patient = await Patient.findOne({ userId: user._id });
        }

        if (!patient) {
            console.log("Target patient not found, picking the first available patient.");
            patient = await Patient.findOne();
        }

        if (!patient) {
            console.error("No patient found. Please seed patients first.");
            process.exit(1);
        }

        // Find a lab
        let lab = await Lab.findOne();
        if (!lab) {
            console.log("No lab found, cannot link report. Creating a mock lab ID for now (might fail validation if strict).");
            // In a real scenario, you'd create a lab or fail. 
            // For resilience, let's assume one exists or we just fail.
            console.error("No lab found. Please seed labs first.");
            process.exit(1);
        }

        const reports = [
            {
                patientId: patient._id,
                forPatientType: "Patient",
                labId: lab._id,
                testName: "Complete Blood Count (CBC)",
                testType: "Hematology",
                result: "Hemoglobin: 13.5 g/dL (Normal). WBC: 7500 /mcL. Platelets: 250,000 /mcL.",
                normalRange: "13.0 - 17.0 g/dL",
                unit: "g/dL",
                diagnosis: "Normal blood count. No signs of infection or anemia.",
                status: "completed",
                scheduledDate: new Date("2025-12-15"),
                timeSlot: "09:00 AM",
                reportPDF: "https://www.who.int/docs/default-source/coronaviruse/situation-reports/20200423-sitrep-94-covid-19.pdf", // Dummy PDF
            },
            {
                patientId: patient._id,
                forPatientType: "Patient",
                labId: lab._id,
                testName: "Lipid Profile",
                testType: "Biochemistry",
                result: "Total Cholesterol: 210 mg/dL (High). HDL: 35 mg/dL (Low). LDL: 150 mg/dL (High).",
                normalRange: "< 200 mg/dL",
                unit: "mg/dL",
                diagnosis: "Hyperlipidemia. Elevated cholesterol levels detected.",
                status: "completed",
                scheduledDate: new Date("2026-01-10"),
                timeSlot: "10:30 AM",
                reportPDF: "https://www.who.int/docs/default-source/coronaviruse/situation-reports/20200423-sitrep-94-covid-19.pdf",
            },
            {
                patientId: patient._id,
                forPatientType: "Patient",
                labId: lab._id,
                testName: "Thyroid Function Test",
                testType: "Endocrinology",
                result: "TSH: 4.5 mIU/L (Borderline High). T3: 120 ng/dL. T4: 8.0 ug/dL.",
                normalRange: "0.4 - 4.0 mIU/L",
                unit: "mIU/L",
                diagnosis: "Subclinical Hypothyroidism. Monitor TSH levels.",
                status: "completed",
                scheduledDate: new Date("2026-01-20"),
                timeSlot: "08:15 AM",
                reportPDF: "https://www.who.int/docs/default-source/coronaviruse/situation-reports/20200423-sitrep-94-covid-19.pdf",
            },
            {
                patientId: patient._id,
                forPatientType: "Patient",
                labId: lab._id,
                testName: "Blood Glucose Fasting",
                testType: "Biochemistry",
                result: "95 mg/dL",
                normalRange: "70 - 100 mg/dL",
                unit: "mg/dL",
                diagnosis: "Normal fasting blood sugar.",
                status: "completed",
                scheduledDate: new Date("2026-01-22"),
                timeSlot: "07:00 AM",
                reportPDF: "https://www.who.int/docs/default-source/coronaviruse/situation-reports/20200423-sitrep-94-covid-19.pdf",
            },
        ];

        await LabReport.insertMany(reports);
        console.log(`Seeded ${reports.length} lab reports.`);

        mongoose.connection.close();
    } catch (error) {
        console.error("Error seeding lab reports:", error);
        process.exit(1);
    }
};

seedLabReports();
