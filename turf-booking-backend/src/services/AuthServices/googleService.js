import { OAuth2Client } from 'google-auth-library';
import * as userModel from '../../models/userModel.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Verify token with Google and extract user info
export const verifyGoogleToken = async (tokenId) => {
    const ticket = await client.verifyIdToken({
        idToken: tokenId,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
        throw new Error('Invalid Google token');
    }

    return {
        email: payload.email,
        name: payload.name,
        google_id: payload.sub,
        picture: payload.picture,
    };
};

// Find user by email or google_id, or create new user
export const findOrCreateUser = async (googleUser) => {
    let user = await userModel.getUserByEmail(googleUser.email);

    if (!user) {
        // Create user if not found
        user = await userModel.createUserWithGoogle(
            googleUser.name,
            googleUser.email,
            googleUser.google_id
        );
    }

    return user;
};
