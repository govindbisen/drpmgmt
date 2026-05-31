import axios from "axios";

let accessToken: string | null = null;
export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

const API = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
});

// #region  Request Interceptor

API.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// #region Response Interceptor

// API.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (
//       error.response?.status === 401 &&
//       originalRequest &&
//       !originalRequest._retry
//     ) {
//       (originalRequest as any)._retry = true;
//       try {
//         const response = await axios.post(
//           "http://localhost:8000/refresh",
//           {},
//           { withCredentials: true },
//         );

//         const newAccessToken = response.data.access_token;
//         setAccessToken(newAccessToken);

//         originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
//         return API(originalRequest);
//       } catch (refreshError) {
//         setAccessToken(null);
//         window.location.href = "/login";
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   },
// );

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        await API.post("/auth/refresh");
        return API(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default API;
