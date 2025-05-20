import express from 'express';
import { createTurfController, getNearbyTurfs, getTurfByIdController, getTurfsByLocationController } from '../controllers/turfController.js';

const router = express.Router();

// Route for creating a turf
router.post('/', createTurfController);

router.get('/nearby', getNearbyTurfs);

// Route for fetching turfs by location
router.get('/location', getTurfsByLocationController);

router.get('/:id', getTurfByIdController);

export default router;