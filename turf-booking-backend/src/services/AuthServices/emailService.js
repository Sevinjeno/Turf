import { emailTransporter } from '../../configs/emailConfig.js';
import { generateOTP } from '../utils/otpGenerator.js';

const otpStore = new Map(); // Temporary store for OTPs (use Redis for production)

/**
 * Send OTP to the provided email address.
 */
export const sendEmailOTP = async (email) => {
    const otp = generateOTP();
    otpStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 }); // Valid for 5 minutes

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is: ${otp}. It is valid for 5 minutes.`,
    };

    try {
        await emailTransporter.sendMail(mailOptions);
        return { message: 'OTP sent successfully', email };
    } catch (error) {
        throw new Error('Error sending email: ' + error.message);
    }
};

/**
 * Validate the provided OTP.
 */
export const validateOTP = (email, otp) => {
    const record = otpStore.get(email);
    if (!record) {
        throw new Error('OTP not found. Please request a new OTP.');
    }

    const { otp: storedOtp, expiresAt } = record;

    if (Date.now() > expiresAt) {
        otpStore.delete(email);
        throw new Error('OTP expired. Please request a new OTP.');
    }

    if (storedOtp !== otp) {
        throw new Error('Invalid OTP.');
    }

    otpStore.delete(email); // Remove OTP after successful validation
    return true;
};