import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import { Patient } from "./models/Patient.js";
import { LabReport } from "./models/LabReport.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const seedLabReports = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB");

        // 1. Find ALL Users
        const users = await User.find({});
        console.log(`Found ${users.length} users. Seeding data for ALL of them...`);

        for (const user of users) {
            console.log(`👤 Processing User: ${user.name} (${user.email})`);

            // 2. Find or Create Patient Profile
            let patient = await Patient.findOne({ userId: user._id });
            if (!patient) {
                console.log("   ⚠️ Patient profile not found. Creating one...");
                patient = new Patient({
                    userId: user._id,
                    gender: "male"
                });
                await patient.save();
            }

            // 3. Fake Lab ID
            const fakeLabId = new mongoose.Types.ObjectId();

            // 4. Define Records
            const reports = [
                {
                    patientId: patient._id,
                    forPatientType: "Patient",
                    labId: fakeLabId,
                    testName: "Complete Blood Count (CBC)",
                    testType: "Hematology",
                    result: "Hemoglobin: 11.5 g/dL (Low), WBC: 12000 /cumm (High)",
                    normalRange: "Hb: 13-17, WBC: 4000-11000",
                    unit: "varied",
                    diagnosis: "Possible Infection (High WBC)",
                    doctorReference: null,
                    scheduledDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
                },
                {
                    patientId: patient._id,
                    forPatientType: "Patient",
                    labId: fakeLabId,
                    testName: "Lipid Profile",
                    testType: "Biochemistry",
                    result: "Total Cholesterol: 240 mg/dL (High)",
                    normalRange: "< 200 mg/dL",
                    unit: "mg/dL",
                    diagnosis: "Hypercholesterolemia (High Cholesterol)",
                    doctorReference: null,
                    scheduledDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
                },
                {
                    patientId: patient._id,
                    forPatientType: "Patient",
                    labId: fakeLabId,
                    testName: "Thyroid Function Test",
                    testType: "Endocrinology",
                    result: "TSH: 2.5 mIU/L (Normal)",
                    normalRange: "0.4 - 4.0 mIU/L",
                    unit: "mIU/L",
                    diagnosis: "Normal Thyroid Function",
                    doctorReference: null,
                    scheduledDate: new Date()
                }
            ];

            // 5. Insert Records
            await LabReport.insertMany(reports);
            console.log(`   ✅ Added 3 records for ${user.name}`);
        }

        console.log("\n✅ GLOBAL PARTIAL COMPLETED: All users have been seeded with lab records.");

    } catch (err) {
        console.error("❌ Error seeding lab records:", err);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

seedLabReports();
