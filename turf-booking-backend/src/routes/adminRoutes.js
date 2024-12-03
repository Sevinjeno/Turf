import express from 'express';
import { createAdminController, getAdminController } from '../controllers/adminController.js';

const router = express.Router();

// Route for creating an admin
router.post('/', createAdminController);

// Route for getting an admin by ID
router.get('/:id', getAdminController);

export default router;