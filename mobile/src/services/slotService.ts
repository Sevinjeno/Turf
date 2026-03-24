import api from "../api/api";

export const fetchTurfSlots = async (
  turfId: string,
  date: string
) => {
  const res = await api.get(`/slots/${turfId}?date=${date}`);
  return res.data;
};