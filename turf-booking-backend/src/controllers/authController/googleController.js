import { verifyGoogleToken, findOrCreateUser } from '../../services/AuthServices/googleService.js';
import { generateAccessToken } from '../../utils/jwtUtils.js';

export const googleLogin = async (req, res) => {
    const { tokenId } = req.body;

    if (!tokenId) {
        return res.status(400).json({ message: "Google token is required" });
    }

    try {
        // Verify the token and get user info from Google
        const googleUser = await verifyGoogleToken(tokenId);

        // Check if user exists, else create
        const user = await findOrCreateUser(googleUser);

        // Generate JWT token for our app
        const token = generateAccessToken(user);

        // Send token as HTTP-only cookie
        res.cookie('user_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
        });

        return res.status(200).json({
            message: "Logged in with Google successfully",
            data: user,
        });

    } catch (error) {
        console.error("Google login error:", error.message);
        return res.status(401).json({ message: error.message });
    }
};
