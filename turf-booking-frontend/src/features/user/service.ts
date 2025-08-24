import axios from "axios";
import { API } from "../../services/api";

export const fetchUserApi = async () => {
  const res = await axios.get(`${API}/api/users/me`, {
    withCredentials: true,
  });
  console.log("res",res)
  return res.data;
};
