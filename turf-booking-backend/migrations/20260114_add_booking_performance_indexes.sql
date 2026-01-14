-- Optimize booking conflict checks


CREATE INDEX IF NOT EXISTS idx_bookings_turf_court_time_confirmed
ON bookings (turf_id, court_id, start_time, end_time)
WHERE status = 'confirmed';
