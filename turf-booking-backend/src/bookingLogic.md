    booking.model.js      → only SQL
    pricing.service.js    → only money logic
    booking.service.js    → booking rules
    booking.controller.js → HTTP only


User
 ↓
Frontend (no math)
 ↓
Booking API
 ↓
Service Layer
   ├─ Fetch turf price (superadmin-set)
   ├─ Fetch platform fee (superadmin-set)
   ├─ Calculate final price
 ↓
Database (ledger-style)



bookings
--------
id
user_id
turf_id
court_id
start_time
end_time

base_price
platform_fee
total_price

admin_earning
platform_earning

status
created_at