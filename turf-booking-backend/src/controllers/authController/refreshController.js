import {
  getUserByRefreshToken,
  saveRefreshToken,
} from "../../models/userModel.js";
import {
  generateRefreshToken,
  generateAccessToken,
  verifyRefreshToken,
} from "../../utils/jwtUtils.js";

export const refreshTokenController = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }

    console.log("Checking Refresh Token", refreshToken);

    // verify token signature + expiry
    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (err) {
      return res.status(403).json({ message: "Expired refresh token" });
    }

    // check DB
    const user = await getUserByRefreshToken(refreshToken);
    if (!user) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // 👉 Only generate a new access token
    const newAccessToken = generateAccessToken(user);

    return res.json({
      accessToken: newAccessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

  } catch (err) {
    console.error("Refresh token error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

