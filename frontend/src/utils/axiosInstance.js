import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // Update if backend is hosted
  withCredentials: true,
});

// Add token to headers
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
