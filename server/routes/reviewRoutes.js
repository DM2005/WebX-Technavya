import express from "express";
import { addReview } from "../controllers/review.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/add", protect, addReview);

export default router;
