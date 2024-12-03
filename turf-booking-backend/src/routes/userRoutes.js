import express from 'express';
import { createUserController, getUserController } from '../controllers/userController.js';

const router = express.Router();

// Route for creating a user
router.post('/', createUserController);

// Route for getting a user by ID
router.get('/:id', getUserController);

export default router;