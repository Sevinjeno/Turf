import jwt from "jsonwebtoken";
import { verifyAccessToken } from "../utils/jwtUtils.js";

// export const authenticate = (req, res, next) => {
//     console.log("req.cookies",req.cookies)
//     console.log("req.headers.authorization",req.headers.authorization)
//     const token = req.cookies.user_token || req.cookies.admin_token || req.headers.authorization?.split(" ")[1];
// console.log("token",token)

//     if (!token) {
//         return res.status(401).json({ message: "Access Denied: No Token Provided" });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//         req.user = decoded; // Attach user details to the request object
//         next();
//     } catch (err) {
//         console.error("JWT Verification Error:", err.message);
//         return res.status(403).json({ message: "Invalid Token" });
//     }
// };


export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  // 1️⃣ No token sent
  if (!authHeader) {
    return res.status(401).json({ error: "NO_ACCESS_TOKEN" });
  }

  // 2️⃣ Extract token
  const token = authHeader.split(" ")[1];
  console.log("token",token)
  if (!token) {
    return res.status(401).json({ error: "MALFORMED_TOKEN" });
  }

  // 3️⃣ Verify
  try {
     const payload = verifyAccessToken(token);
     console.log("payload verifyAccessToken",payload)
    // 4️⃣ Attach user info
    req.user = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: "TOKEN_EXPIRED_OR_INVALID" });
  }
};




export const authorize = (roles) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access Denied: Insufficient Permissions" });
    }

    next();
};
