import pool from "../configs/dbConfig.js";

// Create a new user
export const createUser = async ({
  name = null,
  email = null,
  phone = null,
  google_id = null,
}) => {
  const query = `
        INSERT INTO users (name, email, phone, google_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `;
  const values = [name, email, phone,google_id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// Get user by ID
export const getUserById = async (id) => {
  const query = "SELECT * FROM users WHERE id = $1;";
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// Get user by email (for login)
export const getUserByEmail = async (email) => {
  const query = "SELECT * FROM users WHERE email = $1;";
  const result = await pool.query(query, [email]);
  return result.rows[0]; // If user exists, return the user data, otherwise null
};

// Get user by phone
export const getUserByPhone = async (phone) => {
  const query = "SELECT * FROM users WHERE phone = $1;";
  const result = await pool.query(query, [phone]);
  return result.rows[0];
};

// Get user by Google ID
export const getUserByGoogleId = async (googleId) => {
  const query = "SELECT * FROM users WHERE google_id = $1;";
  const result = await pool.query(query, [googleId]);
  return result.rows[0];
};

// Get all users
export const getAllUsers = async () => {
  const query = "SELECT * FROM users;";
  const result = await pool.query(query);
  return result.rows; // Return all user data
};

export const createUserWithGoogle = async (name, email, googleId) => {
  const query = `
        INSERT INTO users (name, email, google_id, is_verified, verification_method)
        VALUES ($1, $2, $3, true, 'google')
        RETURNING *;
    `;
  const result = await pool.query(query, [name, email, googleId]);
  return result.rows[0];
};

//refresh token
export const saveRefreshToken = async (userId, token) => {
  const query = `UPDATE users SET refresh_token = $1 WHERE id = $2 RETURNING *`;
  const result = await pool.query(query, [token, userId]);
  return result.rows[0];
};

export const getUserByRefreshToken = async (token) => {
  const query = `SELECT * FROM users WHERE refresh_token = $1`;
  const result = await pool.query(query, [token]);
  return result.rows[0];
};

export const deleteRefreshToken = async (userId) => {
  const query = `UPDATE users SET refresh_token = NULL WHERE id = $1`;
  await pool.query(query, [userId]);
};
