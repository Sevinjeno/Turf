--  Add payment tracking and refund support to bookings table

ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS payment_id TEXT,
ADD COLUMN IF NOT EXISTS refund_amount INTEGER DEFAULT 0;