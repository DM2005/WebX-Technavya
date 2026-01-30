
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

// Import Models
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

const seedDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB for enhanced seeding");

        const hashPassword = async (password) => {
            return await bcrypt.hash(password, 10);
        };

        const createOrUpdateUser = async (userData) => {
            let user = await User.findOne({ email: userData.email });
            if (!user) {
                const hashedPassword = await hashPassword(userData.password || 'password123');
                user = new User({ ...userData, password: hashedPassword });
                await user.save();
                console.log(`👤 Created User: ${userData.name} (${userData.role})`);
            }
            return user;
        };

        // --- 1. Admins & Core Entities ---
        const hospitalAdmin = await createOrUpdateUser({
            name: "Dr. Admin Singh",
            email: "hospital_admin@triksha.com",
            phone: "9876543210",
            role: "hospitalAdmin",
            isVerified: true
        });

        const labAdmin = await createOrUpdateUser({
            name: "Lab Admin Verma",
            email: "lab_admin@triksha.com",
            phone: "9876543211",
            role: "labAdmin",
            isVerified: true
        });

        let hospital = await Hospital.findOne({ licenseNumber: "HOSP-123456" });
        if (!hospital) {
            hospital = new Hospital({
                userId: hospitalAdmin._id,
                name: "City Care Hospital",
                phone: "9876543210",
                address: "Sector 62, Noida, UP",
                licenseNumber: "HOSP-123456",
                isVerified: true,
                location: { coordinates: [77.3639, 28.6208] }
            });
            await hospital.save();
            console.log(`🏥 Hospital Ready: ${hospital.name}`);
        }

        let lab = await Lab.findOne({ licenseNumber: "LAB-987654" });
        if (!lab) {
            lab = new Lab({
                userId: labAdmin._id,
                name: "Pathkind Labs",
                address: "Sector 18, Noida, UP",
                phone: "9876543211",
                licenseNumber: "LAB-987654",
                isVerified: true,
                location: { coordinates: [77.3240, 28.5708] },
                testTypes: ["Blood Test", "Urine Test", "Diabetes"],
                averagePrice: 450
            });
            await lab.save();
            console.log(`🧪 Lab Ready: ${lab.name}`);
        }

        // --- 2. Doctors (3 Distinct Doctors) ---
        const doctorsData = [
            { name: "Dr. Rajesh Koothrappali", email: "dr.rajesh@triksha.com", spec: "Cardiologist", exp: 12, fee: 1000 },
            { name: "Dr. Meredith Grey", email: "dr.meredith@triksha.com", spec: "General Physician", exp: 8, fee: 500 },
            { name: "Dr. Strange", email: "dr.strange@triksha.com", spec: "Neurologist", exp: 15, fee: 2000 }
        ];

        const doctorProfiles = [];

        for (const [idx, d] of doctorsData.entries()) {
            const user = await createOrUpdateUser({
                name: d.name,
                email: d.email,
                phone: `987654322${idx}`,
                role: "doctor",
                isVerified: true
            });

            let profile = await Doctor.findOne({ userId: user._id });
            if (!profile) {
                profile = new Doctor({
                    userId: user._id,
                    gender: idx % 2 === 0 ? "male" : "female",
                    specialization: d.spec,
                    experience: d.exp,
                    licenseNumber: `DOC-00${idx + 1}`,
                    hospitalId: hospital._id,
                    isVerified: true,
                    education: "MBBS, MD",
                    consultationFee: d.fee,
                    averageRating: 4.5 + (idx * 0.1),
                    totalReviews: 10 + (idx * 5)
                });
                await profile.save();
                console.log(`👨‍⚕️ Doctor Profile Created: ${d.name}`);
            }
            doctorProfiles.push(profile);
        }

        // --- 3. Patients (5 Distinct Patients) ---
        const patientsData = [
            { name: "Amit Sharma", email: "amit.sharma@gmail.com", gender: "male" },
            { name: "Priya Singh", email: "priya.singh@gmail.com", gender: "female" },
            { name: "Rahul Verma", email: "rahul.verma@gmail.com", gender: "male" },
            { name: "Anjali Gupta", email: "anjali.gupta@gmail.com", gender: "female" },
            { name: "Vikram Malhotra", email: "vikram.m@gmail.com", gender: "male" }
        ];

        const patientProfiles = [];
        const patientUsers = [];

        for (const [idx, p] of patientsData.entries()) {
            const user = await createOrUpdateUser({
                name: p.name,
                email: p.email,
                phone: `998877665${idx}`,
                role: "patient",
                isVerified: true
            });
            patientUsers.push(user);

            let profile = await Patient.findOne({ userId: user._id });
            if (!profile) {
                profile = new Patient({
                    userId: user._id,
                    gender: p.gender
                });
                await profile.save();
                console.log(`😷 Patient Profile Created: ${p.name}`);
            }
            patientProfiles.push(profile);
        }

        // --- 4. Appointments & Records ---
        // Generate flexible dates
        const getDates = () => {
            const today = new Date();
            const past = new Date(today); past.setDate(today.getDate() - Math.floor(Math.random() * 10) - 1);
            const future = new Date(today); future.setDate(today.getDate() + Math.floor(Math.random() * 10) + 1);
            return { past, future };
        };

        let apptCount = 0;

        for (const patient of patientUsers) {
            // Assign random doctor
            const doctor = doctorProfiles[Math.floor(Math.random() * doctorProfiles.length)];
            const { past, future } = getDates();

            // 4.1 Past Appointment (Completed)
            let pastAppt = await Appointment.findOne({ bookedBy: patient._id, status: "completed" });
            if (!pastAppt) {
                pastAppt = new Appointment({
                    bookedBy: patient._id,
                    forPatient: { type: 'self' },
                    patientId: null,
                    age: "30",
                    gender: "Male", // Simplified for seed
                    doctorId: doctor._id,
                    hospitalId: hospital._id,
                    date: past,
                    contact: patient.phone,
                    timeSlot: "10:00 AM",
                    mode: "offline",
                    status: "completed",
                    paymentStatus: "paid"
                });
                await pastAppt.save();
                apptCount++;

                // Add Medical Record for this past appointment
                const patientProfile = patientProfiles.find(p => p.userId.toString() === patient._id.toString());
                if (patientProfile) {
                    const medRecord = new MedicalRecord({
                        patientId: patientProfile._id,
                        appointmentId: pastAppt._id,
                        doctorId: doctor._id,
                        hospitalId: hospital._id,
                        type: "Consultation",
                        forPatientType: 'self',
                        medicines: [{ name: "Paracetamol", dosage: "500mg", frequency: "BD", duration: "3 days" }],
                        notes: `Patient visited for general checkup. Diagnosis: Seasonal Viral.`,
                        prescribedAt: past
                    });
                    await medRecord.save();

                    // Add Review
                    const review = new Review({
                        patientId: patientProfile._id,
                        doctorId: doctor._id,
                        appointmentId: pastAppt._id,
                        rating: 4 + Math.floor(Math.random()),
                        comment: "Good experience."
                    });
                    await review.save();
                }
            }

            // 4.2 Future Appointment (Booked)
            let futureAppt = await Appointment.findOne({ bookedBy: patient._id, status: "booked" });
            if (!futureAppt) {
                futureAppt = new Appointment({
                    bookedBy: patient._id,
                    forPatient: { type: 'self' },
                    patientId: null,
                    age: "30",
                    gender: "Female",
                    doctorId: doctor._id,
                    hospitalId: hospital._id,
                    date: future,
                    contact: patient.phone,
                    timeSlot: "04:00 PM",
                    mode: "offline",
                    status: "booked",
                    paymentStatus: "paid"
                });
                await futureAppt.save();
                apptCount++;
            }
        }

        console.log(`📅 Seeded/Verified ${apptCount} new appointments across ${patientUsers.length} patients.`);

        console.log("🎉 Enhanced Seeding Completed Successfully!");
        process.exit(0);

    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
};

seedDatabase();
