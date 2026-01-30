import dotenv from 'dotenv';
dotenv.config();
console.log("Test Env Script Running");
console.log("MONGO_URI:", process.env.MONGO_URI ? "Found" : "Missing");
console.log("PORT:", process.env.PORT);
console.log("RESEND_API_KEY:", process.env.RESEND_API_KEY ? "Found" : "Missing");
console.log("FIREBASE_PROJECT_ID:", process.env.FIREBASE_PROJECT_ID ? "Found" : "Missing");
