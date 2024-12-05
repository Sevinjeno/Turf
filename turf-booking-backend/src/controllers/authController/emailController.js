import { sendEmailOTP, validateOTP } from '../../services/AuthServices/emailService.js';

/**
 * Controller to handle sending OTP via email.
 */
export const sendOTPController = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const response = await sendEmailOTP(email);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: 'Failed to send OTP', error: error.message });
    }
};

/**
 * Controller to verify the OTP.
 */
export const verifyOTPController = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required' });
    }

    try {
        const isValid = validateOTP(email, otp);
        if (isValid) {
            res.status(200).json({ message: 'OTP verified successfully' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};