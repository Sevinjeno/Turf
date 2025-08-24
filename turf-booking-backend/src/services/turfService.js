import { createTurf, getTurfsByLocation, getTurfById, getTurfsByAdminId, updateTurfInDB } from '../models/turfModel.js';

export const createNewTurf = async (name, location, adminId, imageUrl,startTime, endTime, price,courts,city) => {
    return await createTurf(name, location, adminId, imageUrl,startTime, endTime, price,courts,city);
};

export const fetchTurfsByLocation = async (location) => {
    if (!location) {
        throw new Error('Location is required');
    }
    return await getTurfsByLocation(location);
};

export const fetchTurfById = async (id) => {
    if (!id) {
        throw new Error('ID is required');
    }
    return await getTurfById(id);
};

export const getBookingsForDate = async (turfId, date) => {
    const res = await pool.query(
    "SELECT * FROM bookings WHERE turf_id = $1 AND DATE(start_time) = $2",
    [turfId, date]
  );
  return res.rows;
}

export const generateSlots= async (turf, bookings, date) => {
    const slots = [];
  let current = dayjs(`${date} ${turf.open_time}`);
  const end = dayjs(`${date} ${turf.close_time}`);
  while (current.isBefore(end)) {
    const slotEnd = current.add(turf.slot_duration, "minute");
    const isBooked = bookings.some(
      (b) =>
        dayjs(b.start_time).format("HH:mm") === current.format("HH:mm") &&
        dayjs(b.end_time).format("HH:mm") === slotEnd.format("HH:mm")
    );

    slots.push({
      start: current.format("HH:mm"),
      end: slotEnd.format("HH:mm"),
      is_booked: isBooked,
    });

    current = slotEnd;
  }

  return slots;
}


export const fetchTurfbyAdminId = async (adminId) => {
   if (!adminId) {
        throw new Error('ID is required');
    }
    return await getTurfsByAdminId(adminId);
  }

  export const updateTurfService = async (id, turfData) => {
  const { name, location , startTime, endTime, price ,courts,city } = turfData;
  const {lat, lon } = location;
  const updatedTurf = await updateTurfInDB(id, name, lat, lon, startTime, endTime, price,courts,city);
  return updatedTurf;
};
