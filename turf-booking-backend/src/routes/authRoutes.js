import express from "express";
import dotenv from "dotenv";
import { sendEmailOtpController, verifyEmailOtpController } from "../controllers/authController/emailController.js";
import { sendPhoneOTPController, verifyPhoneOTPController } from "../controllers/authController/phoneController.js";
import { googleLogin } from "../controllers/authController/googleController.js";

dotenv.config();

const router = express.Router();

// Routes for email-based authentication
router.post('/email/send-otp', sendEmailOtpController);
router.post('/email/verify-otp', verifyEmailOtpController);

// Routes for phone-based authentication
router.post('/phone/send-otp', sendPhoneOTPController);
router.post('/phone/verify-otp', verifyPhoneOTPController);

// Route for Google-based authentication
router.post('/google/login', googleLogin);


router.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
});

export default router;
