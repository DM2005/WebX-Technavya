import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const seedVitals = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB");

        const user = await User.findOne({ name: { $regex: /test kp/i } });
        if (!user) {
            console.log("❌ User 'test kp' not found");
            process.exit(1);
        }

        console.log(`👤 Updating vitals for: ${user.name}`);

        user.bloodPressure = "120/80";
        user.heartRate = "72";
        user.oxygenLevel = "98";
        user.temperature = "98.6";

        await user.save();
        console.log("✅ Vitals updated successfully.");

    } catch (err) {
        console.error("❌ Error:", err);
    } finally {
        process.exit(0);
    }
};

seedVitals();
