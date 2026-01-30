
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const debugAuth = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find({ name: { $regex: /test kp/i } });

        console.log(`\nFound ${users.length} users matching 'test kp':`);
        users.forEach(u => {
            console.log(` > ID: ${u._id}`);
            console.log(` > Name: ${u.name}`);
            console.log(` > Role: '${u.role}'`); // Quote it to see whitespace
            console.log(` > Email: ${u.email}`);
            console.log("-------------------");
        });

    } catch (e) { console.error(e); }
    finally { process.exit(0); }
};

debugAuth();
