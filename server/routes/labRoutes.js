import express from "express";
import {
  registerLab,
  getMyLabProfile,
  updateLabProfile,
  verifyLab,
} from "../controllers/lab.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { bookLabAppointment ,getMyLabAppointments, getTodayAppointmentsForLab ,getAllLabAppointments} from "../controllers/labAppointment.controller.js";
import { uploadReportForAppointment } from "../controllers/labAppointment.controller.js";



const router = express.Router();

router.use(protect);

router.post("/register", registerLab);
router.get("/profile", getMyLabProfile);
router.put("/profile",updateLabProfile);
router.patch("/verify/:labId", verifyLab);

// ------------------------------------------------------------


router.post("/book-appointment",bookLabAppointment);
router.get("/appointments",getMyLabAppointments);

router.get("/all-lab-appointments/:labId", getAllLabAppointments);
router.get("/labs/:labId/today-appointments", getTodayAppointmentsForLab);
router.post("/lab-appointments/:id/upload-report", uploadReportForAppointment);


export default router;
