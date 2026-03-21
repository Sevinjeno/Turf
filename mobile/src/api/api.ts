import axios from "axios";
import { getToken, setToken, removeToken } from "../utils/secureStore";
import { navigate } from "../utils/navigation";

export const API_URL = process.env.EXPO_PUBLIC_API_URL!;
const api = axios.create({
  baseURL: API_URL,
});

let isRefreshing = false;
let failedQueue: any[] = [];

// 🔁 Process queued requests
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// 🔥 Attach token to every request
api.interceptors.request.use(async (config) => {
  const token = await getToken("accessToken");

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🔥 Handle response errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ❌ If refresh itself fails → logout
    if (originalRequest.url.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    // 🔥 If token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // queue requests while refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await getToken("refreshToken");

        // 🔥 call refresh API
        const res = await axios.post(
          "http://YOUR_IP:3000/api/auth/refresh",
          { refreshToken }
        );

        const newAccessToken = res.data.accessToken;

        // 🔥 save new token
        await setToken("accessToken", newAccessToken);

        // 🔥 update queued requests
        processQueue(null, newAccessToken);

        // 🔥 retry original request
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } catch (err) {
        // ❌ refresh failed → logout
        processQueue(err, null);

        await removeToken("accessToken");
        await removeToken("refreshToken");

        // 🔥 redirect to login
        // window.location.href = "/login"; // (we’ll fix this for mobile)
        navigate("/login");

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;