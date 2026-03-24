import api from "../api/api";
import { Court } from "../types/court";

export const getCourtsByTurfId = async (
  turfId: string
): Promise<Court[]> => {
  const res = await api.get(`/courts/${turfId}`);
  return res.data;
};