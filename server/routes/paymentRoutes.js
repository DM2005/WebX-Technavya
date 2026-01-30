import express from "express";
import { createOrder , verifyPayment } from "../controllers/payment.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create-order", protect, createOrder);
router.post("/verify-payment", protect, verifyPayment);

export default router;
