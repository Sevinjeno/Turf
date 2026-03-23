import api from "../api/api";
import { Turf } from "../types/turf";

export const getTurfById = async (id: string): Promise<Turf> => {
  const res = await api.get(`/turfs/${id}`);
  return res.data;
};