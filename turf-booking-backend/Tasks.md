## transaction-safe booking creation

Without protection:

Both checks say “slot available”

Both insert booking

Boom → double booking

That happens because availability check and insert are two separate steps.

Transaction-safe means:

“Check availability AND insert booking as one atomic operation.”

Either:

everything succeeds
or

nothing happens

No half-success states.