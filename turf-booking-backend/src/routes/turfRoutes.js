import express from 'express';
import { createTurfController, getTurfsByLocationController } from '../controllers/turfController.js';

const router = express.Router();

// Route for creating a turf
router.post('/', createTurfController);

// Route for fetching turfs by location
router.get('/location', getTurfsByLocationController);

export default router;