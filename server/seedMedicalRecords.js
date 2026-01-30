import mongoose from "mongoose";
import dotenv from "dotenv";
import { MedicalRecord } from "./models/MedicalRecord.js";
import { Doctor } from "./models/Doctor.js";
import { Hospital } from "./models/Hospital.js";
import User from "./models/User.js";
import { Appointment } from "./models/Appointment.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const seedMedicalRecords = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB");

        // 1. Get a Doctor and their Hospital
        const doctor = await Doctor.findOne().populate('userId').populate('hospitalId');
        if (!doctor) {
            console.log("❌ No doctor found. Please create a doctor first.");
            process.exit(1);
        }

        const hospital = doctor.hospitalId;
        console.log(`👨‍⚕️ Using Doctor: ${doctor.userId.name}`);
        console.log(`🏥 Using Hospital: ${hospital.name}`);

        // 2. Get a Patient (User who has booked an appointment)
        const appointment = await Appointment.findOne({ doctorId: doctor._id }).populate('bookedBy');
        if (!appointment) {
            console.log("❌ No appointment found for this doctor.");
            // Fallback: just find any user who is not a doctor/admin
            const user = await User.findOne({ role: 'patient' });
            if (!user) {
                console.log("❌ No patient user found.");
                process.exit(1);
            }
            var patientUser = user;
        } else {
            var patientUser = appointment.bookedBy;
        }

        console.log(`👤 Seeding records for Patient: ${patientUser.name}`);

        // 3. Define Dummy Records
        const records = [
            {
                type: "Consultation",
                diagnosis: "Viral Fever",
                medicines: [ // Corrected from 'medicines' as array to match schema
                    { name: "Paracetamol", dosage: "500mg", frequency: "Twice a day", duration: "5 days" },
                    { name: "Vitamin C", dosage: "500mg", frequency: "Once a day", duration: "10 days" }
                ],
                description: "Patient complanined of high fever and body ache.",
                notes: "Drink plenty of water and rest.",
                prescribedAt: new Date(new Date().setDate(new Date().getDate() - 2)) // 2 days ago
            },
            {
                type: "Checkup",
                diagnosis: "Routine Health Check",
                medicines: [],
                description: "Annual body checkup. BP and Sugar levels are normal.",
                notes: "Maintain healthy diet.",
                prescribedAt: new Date(new Date().setDate(new Date().getDate() - 10)) // 10 days ago
            },
            {
                type: "Lab Report",
                diagnosis: "Blood Test Analysis",
                medicines: [],
                description: "CBC and Lipid Profile reports attached.",
                notes: "Cholesterol slightly high. Avoid oily food.",
                prescribedAt: new Date(new Date().setDate(new Date().getDate() - 15)) // 15 days ago
            },
            {
                type: "Prescription",
                diagnosis: "Mild Migraine",
                medicines: [
                    { name: "Naproxen", dosage: "250mg", frequency: "SOS", duration: "As needed" }
                ],
                description: "Recurring headache on the left side.",
                notes: "Avoid stress and screen time.",
                prescribedAt: new Date(new Date().setDate(new Date().getDate() - 1)) // 1 day ago
            }
        ];

        // 4. Insert Records
        for (const recordData of records) {
            try {
                const dummyAppt = new Appointment({
                    bookedBy: patientUser._id,
                    forPatient: { type: 'self' },
                    patientId: null, // self
                    age: "30",
                    gender: "Male",
                    doctorId: doctor._id,
                    hospitalId: hospital._id,
                    date: recordData.prescribedAt,
                    contact: patientUser.phone || "9999999999",
                    timeSlot: "10:00 AM",
                    mode: "offline",
                    status: "completed",
                    paymentStatus: "paid"
                });
                await dummyAppt.save();

                // Handle the Patient ID requirement
                let patientDoc = await mongoose.model('Patient').findOne({ userId: patientUser._id });
                if (!patientDoc) {
                    console.log("Creating new Patient document for User...");
                    patientDoc = await mongoose.model('Patient').create({
                        userId: patientUser._id,
                        gender: 'male' // Lowercase as per enum in Patient.js
                    });
                }

                const newRecord = new MedicalRecord({
                    patientId: patientDoc._id,
                    appointmentId: dummyAppt._id,
                    doctorId: doctor._id,
                    hospitalId: hospital._id,
                    type: recordData.type,
                    forPatientType: 'self',
                    medicines: recordData.medicines,
                    // Field mapping: 'diagnosis' in my seed is NOT in schema? 
                    // Schema has 'notes', 'medicines' array items contain names/dosages.
                    // Wait, MedicalRecord.js schema does NOT have 'diagnosis' or 'description' fields at root!
                    // It has 'notes' (string) and 'medicines' (array).
                    // This is why it failed silently or validation failed!
                    // I must map 'diagnosis' and 'description' to 'notes' or add fields.
                    // Let's combine them into 'notes'.
                    notes: `${recordData.diagnosis || ''}. ${recordData.description || ''}. ${recordData.notes || ''}`,
                    prescribedAt: recordData.prescribedAt
                });

                await newRecord.save();
                console.log(`✅ Added ${recordData.type}`);
            } catch (innerError) {
                console.error(`❌ Failed to add record ${recordData.type}:`);
                if (innerError.email) console.error(innerError.errors); // Log Mongoose validation errors
                else console.error(innerError);
            }
        }

        console.log("🎉 Seeding Completed Successfully!");
        process.exit(0);

    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
};

seedMedicalRecords();
