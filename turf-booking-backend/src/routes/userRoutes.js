import express from 'express';
import { createUserController, getAllUsersController, getUserController, loginUserController, registerUserController } from '../controllers/userController.js';
import { sendOTPController, verifyOTPController } from "../controllers/authController/emailController.js"
import { authenticate } from '../middlewares/authMiddleware.js';
const router = express.Router();

// router.use(authenticate);

// Route for creating a user
router.post('/', registerUserController);

//route for login 
router.post('/login', loginUserController);

// Route for getting a user by ID
// router.get('/:id', getUserController);
router.get('/:id', authenticate, getUserController);

router.get('/', getAllUsersController);
//email
router.post('/send-otp', sendOTPController);  // Route to send OTP
router.post('/verify-otp', verifyOTPController); // Route to verify OTP

export default router;