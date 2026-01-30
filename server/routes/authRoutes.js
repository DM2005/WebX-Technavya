import express from 'express';
import { loginUser, registerUser ,selectRole,getMe, logoutUser} from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { sendOtp ,verifyOtp , resetPassword} from '../utils/mail.js';
import { sendOtpForRegister, verifyOtpForRegister } from '../utils/verifyEmail.js';


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.patch("/select-role", protect, selectRole);
router.get("/me", protect, getMe);
router.post("/logout",logoutUser)
router.post("/send-otp",sendOtp)
router.post("/verify-otp",verifyOtp)
router.post("/reset-password",resetPassword)



router.post("/sendOtpForRegister",sendOtpForRegister)
router.post("/verifyOtpForRegister",verifyOtpForRegister)

export default router;


