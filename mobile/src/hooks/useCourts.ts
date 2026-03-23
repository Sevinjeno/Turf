import { useEffect, useState } from "react";
import { getCourtsByTurfId } from "../services/courtService";

export const useCourts = (turfId: string) => {
  const [courts, setCourts] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await getCourtsByTurfId(turfId);
      setCourts(res);
    };
    fetch();
  }, [turfId]);

  return { courts };
};