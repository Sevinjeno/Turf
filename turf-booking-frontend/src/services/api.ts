import axios from "axios";
// api.ts
import store from "../store";
import { setAccessToken, logout } from "../features/auth/authSlice";
export const API_URL = "http://localhost:3000/api/slots";

const api = axios.create({
  baseURL: "http://localhost:3000/api", // backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Queue for requests during token refresh
let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (err: any) => void }[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token!);
  });
  failedQueue = [];
};

// Request interceptor: attach access token
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.accessToken;
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 and refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue request while refreshing
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
        // Call refresh token endpoint
        const res = await api.post("/auth/refresh-token"); // backend reads HTTP-only cookie
        const newAccessToken = res.data.accessToken;

        // Update Redux store
        store.dispatch(setAccessToken(newAccessToken));

        // Update default headers for future requests
        api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);

        // Retry original request
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        store.dispatch(logout()); // logout if refresh fails
         window.location.href = "/";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
