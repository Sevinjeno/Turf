import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import "./utils/Cron.js"
import paymentRoutes from './routes/paymentRoutes.js';
import turfRoutes from './routes/turfRoutes.js';
import superAdminRoutes from "./routes/superAdminRoutes.js";
import timeslotRoutes from "./routes/timeslotRoutes.js";
import session from "express-session";
import cors from 'cors'; 
import passport from 'passport';
import authRoutes from "./routes/authRoutes.js"
import "./configs/passport.js"
const app = express();

// Enable CORS for your frontend's origin
const corsOptions = {
    origin: 'http://localhost:5173', // Allow frontend origin
    credentials: true, // Allow credentials (cookies, headers)
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
};
app.use(cors(corsOptions));

app.options('*', (req, res) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.sendStatus(200);
});

// Express session (required for Passport)
app.use(session({ secret: process.env.JWT_SECRET, resave: false, saveUninitialized: false }));
app.use(express.json());
app.use(bodyParser.json());


// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());


// Use routes
app.use('/api/users', userRoutes); 
app.use('/api/admins', adminRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/turfs', turfRoutes);


// Super Admin Routes
app.use('/api/superadmin', superAdminRoutes);
app.use("/auth", authRoutes);
app.use('/api/slots',timeslotRoutes);
// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});