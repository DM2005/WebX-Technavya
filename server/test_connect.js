
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

console.log("Starting simple seed...");
console.log("URI present:", !!process.env.MONGO_URI);

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
connect();
