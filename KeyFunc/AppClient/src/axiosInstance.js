import axios from "axios";
import { useAppDispatch } from "./hooks";
import { refresh } from "./features/authSlice";

export let axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const setupAxiosInstance = (store) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (
        error.response.status === 401 &&
        !originalRequest._retry &&
        originalRequest.url !== "/api/auth/refresh"
      ) {
        console.log(originalRequest.url);
        originalRequest._retry = true;

        const status = await store.dispatch(refresh());

        if (status.payload === 200) {
          console.log(originalRequest.url, originalRequest.config);
          return axiosInstance(originalRequest);
        }
      }
      return Promise.reject(error);
    }
  );
};
export default axiosInstance;
