export const validateBookingDuration = (start, end) => {
  const durationMs = end.getTime() - start.getTime();

  if (durationMs <= 0) {
    throw new Error("INVALID_TIME_RANGE");
  }

  const durationMinutes = durationMs / (1000 * 60);

  if (durationMinutes < 60) {
    throw new Error("MINIMUM_BOOKING_1_HOUR");
  }

  if (durationMinutes % 30 !== 0) {
    throw new Error("BOOKING_MUST_BE_30_MIN_MULTIPLE");
  }

  return {
    durationMinutes,
    durationHours: durationMinutes / 60,
  };
};