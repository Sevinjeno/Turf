import express from "express";
import dotenv from "dotenv";
import { sendEmailOtpController, verifyEmailOtpController } from "../controllers/authController/emailController.js";
import { sendPhoneOTPController, verifyPhoneOTPController } from "../controllers/authController/phoneController.js";
import { googleLogin } from "../controllers/authController/googleController.js";
import { checkValidation, validateEmail, validateOtp, validatePhone } from "../middlewares/Validation.js";

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


router.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
});

export default router;
