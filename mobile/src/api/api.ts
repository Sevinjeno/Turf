import axios from "axios";
import { getToken, setToken } from "../utils/secureStore";

const api = axios.create({
  baseURL: "http://YOUR_IP:3000/api",
});

api.interceptors.request.use(async (config) => {

    const token = await getToken("accessToken");


  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;