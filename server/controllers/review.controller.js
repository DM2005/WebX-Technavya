import { Review } from "../models/Review.js";
import { Doctor } from "../models/Doctor.js";
import { Appointment } from "../models/Appointment.js";
import { Patient } from "../models/Patient.js";

export const addReview = async (req, res) => {
    try {
        const userId = req.user.id;
        const { appointmentId, rating, comment } = req.body;

        if (!appointmentId || !rating) {
            return res.status(400).json({ error: "Appointment ID and Rating are required." });
        }

        // 1. Validate Patient
        const patient = await Patient.findOne({ userId });
        if (!patient) {
            return res.status(404).json({ error: "Patient profile not found." });
        }

        // 2. Validate Appointment
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ error: "Appointment not found." });
        }

        // Verify ownership
        if (appointment.bookedBy.toString() !== userId.toString()) {
            return res.status(403).json({ error: "Unauthorized to review this appointment." });
        }

        if (appointment.status !== "completed") {
            const isPast = new Date(appointment.date) < new Date();
            if (appointment.status === "booked" && isPast) {
                // Auto-complete the appointment
                appointment.status = "completed";
            } else {
                return res.status(400).json({ error: "Can only review completed or past appointments." });
            }
        }

        if (appointment.isReviewed) {
            return res.status(400).json({ error: "Appointment already reviewed." });
        }

        // 3. Create Review
        const newReview = new Review({
            patientId: patient._id,
            doctorId: appointment.doctorId,
            appointmentId,
            rating,
            comment,
        });

        await newReview.save();

        // 4. Update Appointment
        appointment.isReviewed = true;
        await appointment.save();

        // 5. Update Doctor Stats (Average Rating)
        const doctor = await Doctor.findById(appointment.doctorId);
        if (doctor) {
            const currentTotal = doctor.totalReviews || 0;
            const currentAvg = doctor.averageRating || 0;

            const newTotal = currentTotal + 1;
            const newAvg = ((currentAvg * currentTotal) + Number(rating)) / newTotal;

            doctor.totalReviews = newTotal;
            doctor.averageRating = Number(newAvg.toFixed(1));
            await doctor.save();
        }

        res.status(201).json({ message: "Review added successfully.", review: newReview });

    } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).json({ error: "Failed to add review." });
    }
};
