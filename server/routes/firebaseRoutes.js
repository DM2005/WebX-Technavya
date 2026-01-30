import express from "express";
import { sendFirebaseNotification } from "../controllers/firebase.controller.js";

const router = express.Router();

router.post("/send-notification", sendFirebaseNotification);




export default router