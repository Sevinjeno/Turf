import express from 'express';
import { registerSuperAdmin, loginSuperAdmin } from '../controllers/superAdminController.js';

const router = express.Router();

// Register Super Admin
router.post('/register', registerSuperAdmin);

// Login Super Admin
router.post('/login', loginSuperAdmin);

export default router;
