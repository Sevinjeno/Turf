import { useEffect, useState } from "react";
import { fetchTurfSlots } from "../services/slots";

export const useSlots = (turfId: string, date: string) => {
  const [slots, setSlots] = useState([]);
  const [minDuration, setMinDuration] = useState(60);

  useEffect(() => {
    const fetch = async () => {
      const res = await fetchTurfSlots(turfId, date);
      setSlots(res.slots);
      setMinDuration(res.minBookingDuration);
    };

    if (turfId) fetch();
  }, [turfId, date]);

  return { slots, minDuration };
};