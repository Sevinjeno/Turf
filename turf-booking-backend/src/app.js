import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import turfRoutes from './routes/turfRoutes.js';
import cors from 'cors'; 

const app = express();

// Enable CORS for your frontend's origin
const corsOptions = {
    origin: 'http://localhost:5173', // Replace with your frontend's origin
    credentials: true, // Allow credentials (cookies, authorization headers)
};
app.use(cors(corsOptions));


app.use(express.json());
app.use(bodyParser.json());

// Use routes
app.use('/api/users', userRoutes); 
app.use('/api/admins', adminRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/turfs', turfRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});