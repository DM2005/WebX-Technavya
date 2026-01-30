import express from "express";
import { chatBotController } from "../controllers/chatBot.controller.js";

const router = express.Router();

router.post("/chat", chatBotController);

export default router;
