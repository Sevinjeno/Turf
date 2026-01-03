import redis, { storeOtp, getOtp, deleteOtp } from '../../utils/redisClient.js';
import { generateOtp } from '../../utils/OtpUtils.js';
import { fetchUserByEmail, registerUser } from '../userService.js';
import { generateAccessToken } from '../../utils/jwtUtils.js';
import { emailTransporter } from '../../configs/emailConfig.js';

const OTP_EXPIRE_TIME = 300; // 5 minutes

export const sendOtpToEmail = async (email) => {
  const otp = generateOtp();
  try {
  await storeOtp(email, otp, OTP_EXPIRE_TIME);
} catch(err) {
  console.error("❌ Redis storeOtp error:", err);
}

  try {
    const mailOptions = {
      from: `"MyApp" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
      html: `
        <h2>Your OTP is: <b>${otp}</b></h2>
        <p>This OTP will expire in <b>5 minutes</b>. 
        Do not share it with anyone.</p>
      `,
    };

    await emailTransporter.sendMail(mailOptions);
    return { message: "OTP sent to email successfully", email };
  } catch (err) {
    throw new Error("Could not send OTP email. Please try again.");
  }
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
    const token = generateAccessToken(user);
    return { token, user };
};
