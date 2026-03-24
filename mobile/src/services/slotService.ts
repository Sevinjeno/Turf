import api from "../api/api";

export const fetchSlots = async (turfId: number, date: string) => {
  const res = await api.get(
    `/slots/${turfId}/${date}`
  );

  return res.data;
};