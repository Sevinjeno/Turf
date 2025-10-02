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
    const oldRefreshToken = req.cookies.refreshToken;
    if (!oldRefreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }

    console.log("Checking Refresh Token", oldRefreshToken);

    // 1️⃣ Verify refresh token (JWT signature & expiry)
    let decoded;
    try {
      decoded = verifyRefreshToken(oldRefreshToken);
    } catch (err) {
      return res.status(403).json({ message: "Expired refresh token" });
    }

    // 2️⃣ Check in DB if refresh token exists for a user
    const user = await getUserByRefreshToken(oldRefreshToken);
    if (!user) {
      console.log("User not found for this refresh token");
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    console.log("User found:", user.email);

    // 3️⃣ Generate new tokens
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // 4️⃣ Save new refresh token in DB (rotate)
    await saveRefreshToken(user.id, newRefreshToken);

    // 5️⃣ Send new refresh token in cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false, // true in prod with HTTPS
      sameSite: "strict",
      path: "/",
    });

    // 6️⃣ Send new access token + user info in body
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
