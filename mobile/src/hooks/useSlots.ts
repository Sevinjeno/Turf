import { useEffect, useState } from "react";
import { fetchSlots } from "../services/slotService";

export const useSlots = (turfId: number, date: string) => {
  const [slots, setSlots] = useState([]);
  const [minDuration, setMinDuration] = useState(60);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSlots();
  }, [turfId, date]);

  const loadSlots = async () => {
    try {
      setLoading(true);
      const data = await fetchSlots(turfId, date);

      setSlots(data.slots);
      setMinDuration(data.minBookingDuration);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return { slots, minDuration, loading };
};