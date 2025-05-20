import * as timeSlotService from '../services/timeSlotService.js';

// Create a time slot
export const createTimeSlot = async (req, res) => {
    const { turf_id, start_time, end_time, date } = req.body;
    try {
        const slot = await timeSlotService.createTimeSlot(turf_id, start_time, end_time, date);
        res.status(201).json(slot);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Database error" });
    }
};

// Get available slots for a turf on a specific date
export const getAvailableSlots = async (req, res) => {
    const { turf_id, date } = req.params;
    try {
        const slots = await timeSlotService.getAvailableSlots(turf_id, date);
        res.json(slots);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Database error" });
    }
};

// Book a slot
export const bookTimeSlot = async (req, res) => {
    const { id } = req.params;
    try {
        const slot = await timeSlotService.bookTimeSlot(id);
        res.json(slot);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Database error" });
    }
};
