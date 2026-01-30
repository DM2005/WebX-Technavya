console.log("Starting index.js...");
import express from 'express';
import dotenv from 'dotenv';

import { connectDB } from './database/db.js';
import authRoutes from './routes/authRoutes.js';
import cookieParser from "cookie-parser";
import cors from "cors"
import hospitalRoute from "./routes/hospitalRoutes.js"
import patientRoute from "./routes/patientRoutes.js"
import doctorRoute from "./routes/doctorRoutes.js"
import labRoute from "./routes/labRoutes.js"
import firebaseRoute from "./routes/firebaseRoutes.js"
import assistantRoute from "./routes/assistantRoutes.js"
import appointmentRoute from "./routes/appointmentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js"
import aiRouter from "./routes/aiRoutes.js"
import medicalRecordRoutes from "./routes/medicalRecordRoutes.js"
import videoRoutes from './routes/videoRoutes.js'
import paymentRoutes from "./routes/paymentRoutes.js"
import reviewRoutes from "./routes/reviewRoutes.js"




dotenv.config();
const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5178', 'https://nirogcare-in-frontend.vercel.app', 'https://www.nirogcare.in'],
  credentials: true
}));



app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());



connectDB();


app.use('/api/auth', authRoutes);
app.use('/api/hospital', hospitalRoute);
app.use('/api/patient', patientRoute)
app.use('/api/doctor', doctorRoute);
app.use('/api/lab', labRoute)
app.use('/api/firebase', firebaseRoute)
app.use('/api/assistant', assistantRoute)
app.use('/api/appointment', appointmentRoute)
app.use('/api/ai', aiRouter)
app.use('/api/record', medicalRecordRoutes)
app.use('/api/stream', videoRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/review', reviewRoutes);
app.use('/api/admin', adminRoutes);




const PORT = 8000;
console.log('Attempting to start server on port ' + PORT);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


