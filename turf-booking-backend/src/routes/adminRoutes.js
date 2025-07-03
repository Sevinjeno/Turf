import express from 'express';
import { createAdminController, getAdminController, getAllAdminsController } from '../controllers/adminController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();
// Authenticate all admin routes
// router.use(authenticate);

// Route for creating an admin
router.post('/', createAdminController);

//Route for getting all admins
router.get('/', getAllAdminsController);

// Route for getting an admin by ID
router.get('/:id', getAdminController);


// Admin-only routes
// router.get('/dashboard', authorize(['admin']), adminDashboardController); // Admin dashboard


export default router;