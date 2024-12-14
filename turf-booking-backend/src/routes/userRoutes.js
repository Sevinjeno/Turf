import express from 'express';
import { createUserController, getUserController } from '../controllers/userController.js';
import { sendOTPController, verifyOTPController } from "../controllers/authController/emailController.js"
const router = express.Router();

// Route for creating a user
router.post('/', createUserController);

// Route for getting a user by ID
router.get('/:id', getUserController);


//email
router.post('/send-otp', sendOTPController);  // Route to send OTP
router.post('/verify-otp', verifyOTPController); // Route to verify OTP

export default router;