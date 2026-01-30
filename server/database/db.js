import mongoose from "mongoose";
import dotenv from "dotenv";


dotenv.config();


export const connectDB = async () => {
  try {
    const response = await mongoose.connect(process.env.MONGO_URI);
    if (response) {
      console.log("MongoDB connected successfully!!");

    } else {
      console.log("Not connected to MongoDB");
    }
  } catch (error) {
    console.log("MongoDB connection failed!!", error);
  }
};
