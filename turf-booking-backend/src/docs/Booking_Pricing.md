# Booking Pricing Rules

## Minimum Duration
- Minimum booking duration is 1 hour
- Additional time can be added only in 30-minute increments

## Pricing Ownership
- Each turf has its own pricing
- Prices are set and editable only by Superadmin

## Calculation Responsibility
- All price calculations happen on backend
- Frontend only displays values returned by backend

## Platform Fee
- Platform fee is a global percentage
- Applied on total turf amount




## Flow of booking [without payment integration]

So the correct flow is:

    User selects slot on frontend

    Backend validates availability + duration + price

    Backend creates a PENDING booking

    Frontend redirects user to payment gateway

    Payment gateway calls your webhook

    Webhook verifies payment

    Backend confirms booking + locks slot

    Data is safely stored in DB

    No real money needed yet — we simulate payment success using:

    Fake payment intent

    Manual webhook trigger

    Sandbox keys later (Razorpay/Stripe both support this)