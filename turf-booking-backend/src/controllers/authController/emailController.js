import { sendOtpToEmail, verifyOtpForEmail } from '../../services/AuthServices/emailService.js';

export const sendEmailOtpController = async (req, res) => {
    const { email } = req.body;
    try {
        await sendOtpToEmail(email);
        res.status(200).json({ message: 'OTP sent to email' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const verifyEmailOtpController = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const valid = await verifyOtpForEmail(email, otp);
        if (valid) {
            res.status(200).json({ message: 'Email verified successfully' });
        } else {
            res.status(400).json({ message: 'Invalid or expired OTP' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
