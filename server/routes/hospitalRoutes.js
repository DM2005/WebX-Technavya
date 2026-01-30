import express from "express";
import {
  registerHospital,
  getMyHospitalProfile,
  getPatientStats,
  getAllHospitalPatients,
  getAllAssistantsForHospital,
  registerDoctorByHospital,
  registerAssistantByHospital
} from "../controllers/hospital.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/register", registerHospital);

router.get("/profile", getMyHospitalProfile);

router.get("/stats", getPatientStats);

router.get("/patients", getAllHospitalPatients);

router.get('/all-assistants', getAllAssistantsForHospital)

router.post("/add-doctor", registerDoctorByHospital);

router.post("/add-assistant", registerAssistantByHospital);

export default router;
