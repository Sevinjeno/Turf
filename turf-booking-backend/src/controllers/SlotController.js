// src/controllers/slotController.js

import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore.js";
import pool from "../configs/dbConfig.js";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Kolkata"); // Set default timezone to IST
dayjs.extend(isSameOrBefore);
dayjs.extend(utc); // ✅

import { createTimeSlotService } from "../services/SlotService.js";
import { getBookingsByTurfAndDate } from "../services/bookingService.js";
// Create slot manually (optional)
export const createTimeSlot = async (req, res) => {
  const turfId = req.params.id;
  const slotData = req.body;

  try {
    const newSlot = await createTimeSlotService(turfId, slotData);
    res.status(201).json(newSlot);
  } catch (err) {
    console.error("Error creating slot:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all available time slots for a given turf on a date

export const getAvailableSlots = async (req, res) => {
  const { turf_id, date } = req.params;

  try {
    const turfRes = await pool.query("SELECT * FROM turfs WHERE id = $1", [
      turf_id,
    ]);
    if (turfRes.rowCount === 0) {
      return res.status(404).json({ error: "Turf not found" });
    }

    const turf = turfRes.rows[0];
    const slotDuration = 30;
    const minBookingDuration = turf.slot_duration || 60;

    const startTime = dayjs.utc(`${date} ${turf.start_time}`); // ensure UTC
    const endTime = dayjs.utc(`${date} ${turf.end_time}`);

    const allSlots = [];
    let current = startTime;

    while (current.add(slotDuration, "minute").isSameOrBefore(endTime)) {
      const slotStart = current;
      allSlots.push({
        time: slotStart.format("HH:mm"),
        status: "available",
      });
      current = current.add(slotDuration, "minute");
    }

    // ✅ Get bookings in UTC
    const bookedSlots = await getBookingsByTurfAndDate(turf_id, date);

    const bookedTimes = new Set();
    bookedSlots.forEach((booking) => {
      let start = dayjs.utc(booking.start_time).tz("Asia/Kolkata");
      const end = dayjs.utc(booking.end_time).tz("Asia/Kolkata");
      while (start.isSameOrBefore(end)) {
        // ✅ now inclusive
        bookedTimes.add(start.format("HH:mm"));
        start = start.add(slotDuration, "minute");
      }
    });

    // ✅ Get blocked/event slots (convert to IST too)
    const slotQuery = `
      SELECT start_time, end_time, is_blocked, is_event FROM slots
      WHERE turf_id = $1 AND DATE(start_time AT TIME ZONE 'UTC') = $2
    `;
    const slotRes = await pool.query(slotQuery, [turf_id, date]);
    slotRes.rows.forEach((slot) => {
      let start = dayjs.utc(slot.start_time).tz("Asia/Kolkata");
      const end = dayjs.utc(slot.end_time).tz("Asia/Kolkata");
      while (start.isSameOrBefore(end)) {
        // ✅ now inclusive
        const timeStr = start.format("HH:mm");
        if (slot.is_blocked || slot.is_event) bookedTimes.add(timeStr);
        start = start.add(slotDuration, "minute");
      }
    });

    const finalSlots = allSlots.map((slot) => ({
      ...slot,
      status: bookedTimes.has(slot.time) ? "booked" : "available",
    }));


    return res.status(200).json({
      slots: finalSlots,
      minBookingDuration,
    });
  } catch (err) {
    console.error("Error fetching available slots:", err);
    res.status(500).json({ error: "Server error" });
  }
};
