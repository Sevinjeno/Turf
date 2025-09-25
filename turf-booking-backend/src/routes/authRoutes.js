import express from "express";
import dotenv from "dotenv";
import { sendEmailOtpController, verifyEmailOtpController } from "../controllers/authController/emailController.js";
import { sendPhoneOTPController, verifyPhoneOTPController } from "../controllers/authController/phoneController.js";
import { googleLogin } from "../controllers/authController/googleController.js";
import { checkValidation, validateEmail, validateOtp, validatePhone } from "../middlewares/Validation.js";
import { refreshTokenController } from "../controllers/authController/refreshController.js";
import { logoutController } from "../controllers/authController/logoutController.js";

dotenv.config();

const router = express.Router();

//routes for email
router.post('/email/send-otp', validateEmail, checkValidation, sendEmailOtpController);
router.post('/email/verify-otp', [...validateEmail, ...validateOtp], checkValidation, verifyEmailOtpController);

// Routes for phone-based authentication
router.post('/phone/send-otp', validatePhone, checkValidation, sendPhoneOTPController);
router.post('/phone/verify-otp', [...validatePhone, ...validateOtp], checkValidation, verifyPhoneOTPController);

// Route for Google-based authentication
router.post('/google/login', googleLogin);

router.post('/refresh', refreshTokenController);

router.get("/logout", logoutController);

export default router;
