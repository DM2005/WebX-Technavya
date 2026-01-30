import express from 'express';
import { protect, isAdmin } from '../middlewares/auth.middleware.js';
import {
	getAdminStats,
	getUserById,
	deleteUser,
	getAllHospitals,
	createHospitalForUser,
	deleteHospital,
} from '../controllers/admin.controller.js';

const router = express.Router();

// Define admin routes only; implementation lives in controllers
router.get('/stats', protect, isAdmin, getAdminStats);

// Users management
router.get('/users/:id', protect, isAdmin, getUserById);
router.delete('/users/:id', protect, isAdmin, deleteUser);

// Hospitals management
router.get('/hospitals', protect, isAdmin, getAllHospitals);
router.post('/hospitals', protect, isAdmin, createHospitalForUser);
router.delete('/hospitals/:id', protect, isAdmin, deleteHospital);

export default router;
