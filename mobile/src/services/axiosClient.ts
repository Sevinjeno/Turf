// import axios from "axios";
// import store from "../store";
// import { setAccessToken, logout } from "../store/features/auth/authSlice";
// import { getRefreshToken } from "../services/tokenService";

// export const API_URL = "http://localhost:3000/api/";

// export const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// let isRefreshing = false;
// let failedQueue: any[] = [];

// const processQueue = (error: any, token: string | null = null) => {
//   failedQueue.forEach((p) => {
//     if (error) p.reject(error);
//     else p.resolve(token);
//   });

//   failedQueue = [];
// };


// // Request Interceptor


// api.interceptors.request.use((config) => {
//   const token = store.getState().auth.accessToken;

//   if (token && config.headers) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });


// // Response Interceptor


// api.interceptors.response.use(
//   (res) => res,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {

//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         }).then((token) => {
//           originalRequest.headers.Authorization = `Bearer ${token}`;
//           return api(originalRequest);
//         });
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       try {
//         const refreshToken = await getRefreshToken();

//         const res = await axios.post(API_URL + "auth/refresh", {
//           refreshToken,
//         });

//         const newAccessToken = res.data.accessToken;

//         store.dispatch(setAccessToken(newAccessToken));

//         processQueue(null, newAccessToken);

//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

//         return api(originalRequest);
//       } catch (err) {
//         processQueue(err, null);
//         store.dispatch(logout());
//         return Promise.reject(err);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   }
// );