import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import {registerAssistant,getAssistantProfile} from "../controllers/assistant.controller.js"

const router = express.Router();


router.post('/update-profile' ,protect, registerAssistant)
router.get('/get-profile', protect, getAssistantProfile)



export default router