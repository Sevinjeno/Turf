import { getUserByRefreshToken, saveRefreshToken } from "../../models/userModel.js";
import { generateRefreshToken, generateToken, verifyRefreshToken } from "../../utils/jwtUtils.js";

export const refreshTokenController = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: "No refresh token" });

    // Check DB
    const user = await getUserByRefreshToken(refreshToken);
    if (!user) return res.status(403).json({ message: "Invalid refresh token" });

    // Verify JWT
    try {
      verifyRefreshToken(refreshToken);
    } catch (err) {
      return res.status(403).json({ message: "Expired refresh token" });
    }

    // Generate new tokens
    const newAccessToken = generateToken(user);
    const newRefreshToken = generateRefreshToken(user); 

    // Update DB
    await saveRefreshToken(user.id, newRefreshToken);

    // Set cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/",
    });

    return res.json({ accessToken: newAccessToken });

  } catch (err) {
    console.error("Refresh token error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
