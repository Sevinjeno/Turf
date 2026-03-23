import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { BookingPreviewResponse } from "../types/bookings";
import { previewBooking } from "../services/bookingService";

export const useBookingPreview = ({
  selectedSlot,
  selectedDate,
  selectedCourt,
  turfId,
}) => {
  const [pricePreview, setPricePreview] =
    useState<BookingPreviewResponse | null>(null);
  const [priceLoading, setPriceLoading] = useState(false);
  const [priceError, setPriceError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!selectedSlot?.start || !selectedSlot?.end || !selectedCourt)
        return;

      try {
        setPriceLoading(true);

        const startTime = dayjs(
          `${selectedDate}T${selectedSlot.start.time}`
        ).toISOString();

        const endTime = dayjs(
          `${selectedDate}T${selectedSlot.end.time}`
        ).toISOString();

        const result = await previewBooking({
          turf_id: turfId,
          start_time: startTime,
          end_time: endTime,
          court_id: selectedCourt,
        });

        setPricePreview(result);
      } catch {
        setPriceError("Failed to fetch preview");
      } finally {
        setPriceLoading(false);
      }
    };

    run();
  }, [selectedSlot, selectedDate, selectedCourt]);

  return { pricePreview, priceLoading, priceError };
};