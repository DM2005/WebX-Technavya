import express from 'express'

import { tokenProvider } from '../controllers/video.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
const router  = express.Router();



router.post('/get-token',protect,tokenProvider)


export default router;