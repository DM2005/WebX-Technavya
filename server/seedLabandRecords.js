
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js"; // Default import
import { Doctor } from "./models/Doctor.js";
import { Hospital } from "./models/Hospital.js";
import { Lab } from "./models/Lab.js";
import { LabAppointment } from "./models/LabAppointment.js";
import { MedicalRecord } from "./models/MedicalRecord.js";
import { Appointment } from "./models/Appointment.js";
import { Patient } from "./models/Patient.js";

dotenv.config();

// Standardize connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const samplePDF = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

const seedData = async () => {
    await connectDB();

    try {
        // 1. Fetch reference data
        const users = await User.find({ role: "patient" });
        const doctors = await Doctor.find({});
        const hospitals = await Hospital.find({});
        const labs = await Lab.find({});

        console.log(`Found ${users.length} patient-users, ${labs.length} labs, ${doctors.length} doctors, ${hospitals.length} hospitals.`);

        if (users.length === 0) {
            console.log("No users with patient role found.");
            process.exit(1);
        }

        const labTestTypes = ["Blood", "X-Ray", "MRI", "CT Scan", "Urine", "Other"];
        const labTestNames = {
            "Blood": "Complete Blood Count",
            "X-Ray": "Chest X-Ray",
            "MRI": "Brain MRI",
            "CT Scan": "Abdominal CT",
            "Urine": "Routine Analysis",
            "Other": "General Checkup"
        };

        const recordTypes = ['Consultation', 'Prescription', 'Surgery', 'Checkup'];

        // 2. Seed data
        for (const user of users) {
            console.log(`Seeding data for User: ${user.name}`);

            // Ensure Patient record exists
            let patientDoc = await Patient.findOne({ userId: user._id });
            if (!patientDoc) {
                console.log(`  Creating Patient profile for ${user.name}`);
                patientDoc = new Patient({
                    userId: user._id,
                    gender: "male" // Default
                });
                await patientDoc.save();
            }

            // --- Seed Lab Appointments (Reports) ---
            // LabAppointment uses User ID (bookedBy)
            if (labs.length > 0) {
                for (let i = 0; i < 3; i++) {
                    const randomLab = labs[Math.floor(Math.random() * labs.length)];
                    const randomType = labTestTypes[Math.floor(Math.random() * labTestTypes.length)];
                    const randomTestName = labTestNames[randomType];

                    const status = Math.random() > 0.3 ? "Completed" : "Pending";
                    const scheduledDate = new Date();
                    scheduledDate.setDate(scheduledDate.getDate() - Math.floor(Math.random() * 30));

                    const labAppt = new LabAppointment({
                        bookedBy: user._id,
                        forPatientType: "self",
                        labId: randomLab._id,
                        testDetails: {
                            testName: randomTestName,
                            testType: randomType
                        },
                        scheduledDate: scheduledDate,
                        timeSlot: "10:00 AM - 10:30 AM",
                        notes: "Routine checkup",
                        status: status,
                        reportPDF: status === "Completed" ? samplePDF : undefined,
                        issuedAt: status === "Completed" ? new Date() : undefined
                    });

                    await labAppt.save();
                }
                console.log(`  Added 3 Lab Reports (LabAppointments)`);
            }

            // --- Seed Medical Records ---
            // MedicalRecord uses Patient ID (patientId)
            if (doctors.length > 0 && hospitals.length > 0) {
                for (let i = 0; i < 3; i++) {
                    const randomDoc = doctors[Math.floor(Math.random() * doctors.length)];
                    const randomHosp = hospitals[Math.floor(Math.random() * hospitals.length)];
                    const randomType = recordTypes[Math.floor(Math.random() * recordTypes.length)];

                    const apptDate = new Date();
                    apptDate.setDate(apptDate.getDate() - Math.floor(Math.random() * 60));

                    // Create valid Appointment (uses User ID for bookedBy, Patient Doc ID for patientId)
                    const dummyAppt = new Appointment({
                        bookedBy: user._id,
                        forPatient: { type: "self" },
                        age: "25",
                        gender: "male",
                        contact: "9876543210",
                        doctorId: randomDoc._id,
                        hospitalId: randomHosp._id,
                        patientId: patientDoc._id, // Use Patient Document ID
                        date: apptDate,
                        timeSlot: "11:00 AM - 11:30 AM",
                        mode: "offline",
                        status: "completed",
                    });
                    await dummyAppt.save();

                    const record = new MedicalRecord({
                        patientId: patientDoc._id, // Use Patient Document ID
                        appointmentId: dummyAppt._id,
                        doctorId: randomDoc._id,
                        hospitalId: randomHosp._id,
                        type: randomType,
                        forPatientType: "self",
                        medicines: [
                            {
                                name: "Amoxicillin",
                                dosage: "500mg",
                                frequency: "Three times a day",
                                duration: "7 days",
                                notes: "After food"
                            }
                        ],
                        notes: `Patient visited for ${randomType}. Diagnosis confirmed by Dr. ${randomDoc.name || 'Unknown'}.`
                    });

                    await record.save();
                }
                console.log(`  Added 3 Medical Records`);
            }
        }

        console.log("Seeding completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Seeding error:", error);
        if (error.errors) {
            for (const field in error.errors) {
                console.error(`  Field ${field}: ${error.errors[field].message}`);
            }
        }
        process.exit(1);
    }
};

seedData();
