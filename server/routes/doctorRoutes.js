import express from "express";
import {
  doctorProfile,
  todaysPatients,
  addMedicineRecord,
  getMedicineRecords,
  getDoctorsByHospital,
  allTodaysAppointment,
  getDoctorProfile,
  allTodaysOnlineAppointment,
  getPatientProfile
} from "../controllers/doctor.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();


router.use(protect);


router.post("/profile", doctorProfile);
router.get("/get-profile", getDoctorProfile)


router.get("/patients", todaysPatients);


router.post("/medicine", addMedicineRecord);


router.get("/medicine/:patientId/:forPatientType", getMedicineRecords);

router.get("/getAllDoctors", getDoctorsByHospital)

router.get("/getAllDrAppointments", allTodaysAppointment);


router.get("/getOnlineAppointments", allTodaysOnlineAppointment)

router.get("/patient-profile/:patientId", getPatientProfile);

export default router;
