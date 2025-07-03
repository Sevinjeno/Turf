import express from 'express';
import { createTimeSlot, getAvailableSlots, bookTimeSlot } from '../controllers/timeSlotController.js';

const router = express.Router();

router.post('/create', createTimeSlot);
router.get('/:turf_id/:date', getAvailableSlots);
router.put('/book/:id', bookTimeSlot);

export default router;