import { saveRefreshToken } from '../../models/userModel.js';
import { sendOtpToEmail, verifyOtpForEmail } from '../../services/AuthServices/emailService.js';
import { fetchUserByEmail, registerUser } from '../../services/userService.js';
import { generateRefreshToken, generateToken } from '../../utils/jwtUtils.js';
import { deleteOtp, getOtp } from '../../utils/RedisClient.js';

export const sendEmailOtpController = async (req, res) => {
  const { email } = req.body;
  console.log(email)
    try {
        await sendOtpToEmail(email);
        res.status(200).json({ message: 'OTP sent to email' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const verifyEmailOtpController = async (req, res) => {
  const { email, otp } = req.body; // always declared before try
console.log("Request Body:", req.body);
  try {
    console.log("email", email);
    console.log("otp", otp);

    const storedOtp = await getOtp(email);
    console.log("Stored OTP:", storedOtp);

    if (!storedOtp) {
      // OTP expired or never issued
      return res.status(400).json({ message: "OTP expired or not found" });
    }

    if (storedOtp.trim() !== otp.trim()) {
      // Incorrect OTP
      return res.status(400).json({ message: "Incorrect OTP" });
    }

    // OTP is valid → delete from Redis so it can't be reused
    await deleteOtp(email);

    //find or create user

    let user= await fetchUserByEmail(email)
    if(!user){
      user=await registerUser(email)
    }


    console.log("user",user)

      // ✅ Generate tokens
  const accessToken = generateToken(user);
  const refreshToken = generateRefreshToken(user);

    // Save refresh token in DB
    await saveRefreshToken(user?.id, refreshToken);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    path: "/",
  });

    return res.status(200).json({ message: "Email verified successfully",accessToken,user:{id:user.id,email:user.email,phone:user.phone,name:user.name} });
  } catch (err) {
    console.error(`Error verifying OTP for ${email}:`, err);
    return res.status(500).json({ message: "Server error" });
  }
};
