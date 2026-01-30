import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Appointment } from './models/Appointment.js';
import { Doctor } from './models/Doctor.js';
import { Hospital } from './models/Hospital.js';
import User from './models/User.js';

dotenv.config();

const seedAppointment = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        // 1. Fetch ALL Hospitals
        const hospitals = await Hospital.find();
        if (hospitals.length === 0) throw new Error("No hospitals found");
        console.log(`Found ${hospitals.length} hospitals. Seeding for all...`);

        // 2. Fetch a User to act as the patient (or create one)
        let patientUser = await User.findOne({ role: 'patient' });
        if (!patientUser) {
            patientUser = await User.findOne();
        }

        // 3. Loop through hospitals
        for (const hospital of hospitals) {
            // Find a doctor for this hospital
            const doctor = await Doctor.findOne({ hospitalId: hospital._id });
            if (!doctor) {
                console.log(`Skipping hospital ${hospital.name}: No doctor found`);
                continue;
            }

            const today = new Date();
            const futureTime = new Date(today);
            futureTime.setHours(today.getHours() + 2);

            const appointment = new Appointment({
                bookedBy: patientUser._id,
                forPatient: { type: 'self' },
                patientId: null,
                age: "30",
                gender: "male",
                doctorId: doctor._id,
                hospitalId: hospital._id,
                date: today,
                contact: "9876543210",
                timeSlot: futureTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                mode: "offline",
                status: "booked",
                paymentStatus: "paid"
            });

            await appointment.save();
            console.log(`✅ Seeded for hospital: ${hospital.name}`);
        }

    } catch (error) {
        console.error("Seeding failed:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected");
    }
};

seedAppointment();
