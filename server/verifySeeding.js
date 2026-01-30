
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';

// Import Models (Same as seedAll.js)
import User from './models/User.js';
import { Doctor } from './models/Doctor.js';
import { Hospital } from './models/Hospital.js';
import { Lab } from './models/Lab.js';
import { Patient } from './models/Patient.js';
import { Appointment } from './models/Appointment.js';
import { MedicalRecord } from './models/MedicalRecord.js';
import { LabReport } from './models/LabReport.js';
import { Review } from './models/Review.js';
import VitalStats from './models/VitalStats.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const verify = async () => {
    let output = "";
    const log = (msg) => {
        console.log(msg);
        output += msg + "\n";
    };

    try {
        await mongoose.connect(MONGO_URI);
        log("✅ Connected to MongoDB for verification");

        const counts = {
            Users: await User.countDocuments(),
            Doctors: await Doctor.countDocuments(),
            Hospitals: await Hospital.countDocuments(),
            Labs: await Lab.countDocuments(),
            Patients: await Patient.countDocuments(),
            Appointments: await Appointment.countDocuments(),
            MedicalRecords: await MedicalRecord.countDocuments(),
            LabReports: await LabReport.countDocuments(),
            Reviews: await Review.countDocuments(),
            VitalStats: await VitalStats.countDocuments()
        };

        log("\n--- Database Counts ---");
        for (const [key, value] of Object.entries(counts)) {
            log(`${key}: ${value}`);
        }

        if (counts.Users > 0 && counts.Doctors > 0 && counts.Appointments > 0) {
            log("\n✅ Seeding appears successful (Basic counts > 0).");
        } else {
            log("\n⚠️ Seeding might have failed or data is missing.");
        }

    } catch (error) {
        log(`❌ Verification failed: ${error.message}`);
    } finally {
        await mongoose.disconnect();
        fs.writeFileSync('verification_result.txt', output);
        process.exit(0);
    }
};

verify();
