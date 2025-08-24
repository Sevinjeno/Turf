import express from 'express';
import { createTimeSlot, getAvailableSlots } from '../controllers/SlotController.js';

const router = express.Router();
router.post('/slots/:id', createTimeSlot);
router.get('/:turf_id/:date', getAvailableSlots);

export default router;