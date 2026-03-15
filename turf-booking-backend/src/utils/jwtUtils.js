
import jwt from "jsonwebtoken";

// 🔐 Secrets (make sure these are set in your .env file!)
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access_token_secret_dev";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN || "refresh_token_secret_dev";

console.log("ACCESS_TOKEN_SECRET",ACCESS_TOKEN_SECRET)

// Expiration times
const ACCESS_TOKEN_EXPIRATION = "15m";  // Short-lived (15 min - 1 hr)
const REFRESH_TOKEN_EXPIRATION = "90d"; // Long-lived (30–90 days)

// ================================
// Generate Access Token
// ================================
export const generateAccessToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRATION,
  });
};

// ================================
// Generate Refresh Token
// ================================
export const generateRefreshToken = (user) => {
  const payload = {
    id: user.id, // Keep minimal
  };

  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRATION,
  });
};

// ================================
// Verify Access Token
// ================================
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired access token");
  }
};

// ================================
// Verify Refresh Token
// ================================
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
};

