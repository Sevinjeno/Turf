import nodemailer from 'nodemailer';

export const emailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,  // Your Gmail address
        pass: process.env.EMAIL_PASS,  // Your Gmail app password
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