import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
export const emailTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // E.g., smtp.gmail.com
    port: process.env.SMTP_PORT || 587, // Default to 587 (STARTTLS)
    secure: process.env.SMTP_SECURE === 'true', // true for port 465, false for others
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Verify connection configuration
emailTransporter.verify((error) => {
    if (error) {
        console.error('Error connecting to email service:', error);
    } else {
        console.log('Connected to email service!');
    }
});