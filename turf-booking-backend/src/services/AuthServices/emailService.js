import { storeOtp, getOtp, deleteOtp } from '../../utils/redisClient.js';
import { generateOtp } from '../../utils/OtpUtils.js';
import { fetchUserByEmail, registerUser } from '../userService.js';
import { generateToken } from '../../utils/jwtUtils.js';

const OTP_EXPIRE_TIME = 300; // 5 minutes

export const sendOtpToEmail = async (email) => {
    const otp = generateOtp();
    await storeOtp(email, otp, OTP_EXPIRE_TIME);

    // TODO: Integrate with Email API like SendGrid, Mailgun etc.
    console.log(`Sending OTP ${otp} to email ${email}`);

    return { message: 'OTP sent to email successfully', email };
};

export const verifyOtpForEmail = async (email, otp) => {
    const storedOtp = await getOtp(email);
    if (!storedOtp || storedOtp !== otp) {
        throw new Error('Invalid or expired OTP');
    }
    await deleteOtp(email);

    let user = await fetchUserByEmail(email);
    if (!user) {
        user = await registerUser({ email });
    }
    const token = generateToken(user);
    return { token, user };
};
