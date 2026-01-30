import mongoose from "mongoose";
import dotenv from "dotenv";
import { Doctor } from "./models/Doctor.js";

dotenv.config();

const seedRatings = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const doctors = await Doctor.find({});
        console.log(`Found ${doctors.length} doctors. Updating ratings...`);

        for (const doc of doctors) {
            // Random rating between 3.5 and 5.0
            const randomRating = (Math.random() * (5.0 - 3.5) + 3.5).toFixed(1);
            const randomReviews = Math.floor(Math.random() * 50) + 5;

            doc.averageRating = Number(randomRating);
            doc.totalReviews = randomReviews;
            await doc.save();
        }

        console.log("✅ Ratings seeded successfully for all doctors.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding ratings:", error);
        process.exit(1);
    }
};

seedRatings();
