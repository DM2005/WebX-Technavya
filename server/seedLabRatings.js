import mongoose from "mongoose";
import dotenv from "dotenv";
import { Lab } from "./models/Lab.js";

dotenv.config();

const seedLabRatings = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const labs = await Lab.find({});
        console.log(`Found ${labs.length} labs. Updating ratings and prices...`);

        let updatedCount = 0;
        for (const lab of labs) {
            // Random rating between 3.5 and 5.0
            const randomRating = (Math.random() * (5.0 - 3.5) + 3.5).toFixed(1);
            const randomReviews = Math.floor(Math.random() * 50) + 5;
            // Random price between 300 and 2000
            const randomPrice = Math.floor(Math.random() * (2000 - 300) + 300);

            await Lab.updateOne(
                { _id: lab._id },
                {
                    $set: {
                        averageRating: Number(randomRating),
                        totalReviews: randomReviews,
                        averagePrice: randomPrice
                    }
                }
            );
            updatedCount++;
        }

        console.log(`✅ Successfully updated ${updatedCount} labs with ratings and prices.`);
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding lab ratings:", error);
        process.exit(1);
    }
};

seedLabRatings();
