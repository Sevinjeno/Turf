import jwt from 'jsonwebtoken';

// Secret key for JWT (should be stored in environment variables for security)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const JWT_EXPIRATION = '7d';  // Token expiration time

// Function to generate JWT token
export const generateToken = (user) => {
    const payload = {
        userId: user.id,
        email: user.email,
        name: user.name,
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
};

// Function to verify JWT token
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};