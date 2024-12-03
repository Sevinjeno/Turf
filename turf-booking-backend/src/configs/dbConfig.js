
import pkg from 'pg';
const { Pool } = pkg; //for pool , I did this because pg is  commonjs module , which was conflicting with the es6 modules
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

pool.on('connect', () => {
    console.log('Connected to the database');
});

export default pool;