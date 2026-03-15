# Slot Courts Booking Conflicts 


        \d courts;
        \d units;
        \d court_units;
        \d bookings;
        \d booking_units;

        
STEP 1 — COURTS TABLE (you mostly have this)

Each court is a bookable option with its own price.

CREATE TABLE IF NOT EXISTS courts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  turf_id UUID NOT NULL REFERENCES turfs(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  price_per_hour NUMERIC(10,2) NOT NULL,

  is_active BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_courts_turf_id ON courts(turf_id);


Why

Court = what user selects

Price belongs here (not turf anymore)

Deleting turf deletes its courts safely

STEP 2 — UNITS TABLE (physical reality)

This is the most important table in your entire system.

CREATE TABLE IF NOT EXISTS units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  turf_id UUID NOT NULL REFERENCES turfs(id) ON DELETE CASCADE,

  name TEXT NOT NULL, -- U1, U2, U3, etc.

  created_at TIMESTAMP DEFAULT NOW(),

  UNIQUE (turf_id, name)
);

CREATE INDEX idx_units_turf_id ON units(turf_id);


Why

Units represent real physical space

Courts are just compositions of units

This is what prevents impossible overlaps

STEP 3 — COURT_UNITS (composition layer)

This is the generalization magic.

CREATE TABLE IF NOT EXISTS court_units (
  court_id UUID NOT NULL REFERENCES courts(id) ON DELETE CASCADE,
  unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,

  PRIMARY KEY (court_id, unit_id)
);

CREATE INDEX idx_court_units_court_id ON court_units(court_id);
CREATE INDEX idx_court_units_unit_id ON court_units(unit_id);


Why

One court → many units

One unit → many courts

Supports:

2 halves

3 halves

6 halves

Full + partial

No logic changes ever again

Interviewers love this table.

STEP 4 — BOOKINGS TABLE (slight evolution)

This is your booking header.

CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID NOT NULL REFERENCES users(id),
  turf_id UUID NOT NULL REFERENCES turfs(id),
  court_id UUID NOT NULL REFERENCES courts(id),

  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,

  status TEXT NOT NULL CHECK (
    status IN ('pending', 'confirmed', 'cancelled')
  ),

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_bookings_turf_date
  ON bookings (turf_id, start_time, end_time);

CREATE INDEX idx_bookings_court_id
  ON bookings (court_id);


Why

Court is now mandatory

Turf kept for faster filtering

Time range indexed for availability queries

STEP 5 — BOOKING_UNITS (runtime truth)

This is what makes conflict checks fast and scalable.

CREATE TABLE IF NOT EXISTS booking_units (
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,

  PRIMARY KEY (booking_id, unit_id)
);

CREATE INDEX idx_booking_units_unit_id ON booking_units(unit_id);


Why

Each booking explicitly occupies units

Conflict checks become simple set intersections

No recalculating mappings every request

Massive scale friendly

STEP 6 — (Optional but recommended) BLOCKED SLOTS

You already have something similar, but this aligns it.

CREATE TABLE IF NOT EXISTS blocked_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  turf_id UUID NOT NULL REFERENCES turfs(id) ON DELETE CASCADE,
  unit_id UUID REFERENCES units(id), -- NULL = entire turf

  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,

  reason TEXT,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_blocked_slots_turf_time
  ON blocked_slots (turf_id, start_time, end_time);


Why

Maintenance

Events

Partial closures

Same logic path as bookings

STEP 7 — Sanity check (run these)

After creating tables, run:

\d courts;
\d units;
\d court_units;
\d bookings;
\d booking_units;


You should see the model clearly now.