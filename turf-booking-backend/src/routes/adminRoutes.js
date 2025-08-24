import express from 'express';
import { createAdminController, getAdminByIdController, getAdminDataController, getAllAdminsController, loginAdminController, logoutAdminController } from '../controllers/adminController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();
// Authenticate all admin routes
// router.use(authenticate);

// Route for creating an admin
router.post('/', createAdminController);

//Route for getting all admins
router.get('/', getAllAdminsController);
router.get('/me', authenticate, getAdminDataController);


router.post('/login', loginAdminController);
router.post('/logout', logoutAdminController);

// Route for getting an admin by ID
router.get('/:id', getAdminByIdController);

// Admin-only routes
// router.get('/dashboard', authorize(['admin']), adminDashboardController); // Admin dashboard


export default router;