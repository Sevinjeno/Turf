import { deleteRefreshToken, getUserByRefreshToken } from "../../models/userModel.js";

export const logoutController = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(400).json({ message: "No refresh token" });

    // Delete token from DB
    const user = await getUserByRefreshToken(refreshToken);
    if (user) await deleteRefreshToken(user.id);

    // Clear cookie
    res.clearCookie("refreshToken", { httpOnly: true, path: "/" });

    return res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
