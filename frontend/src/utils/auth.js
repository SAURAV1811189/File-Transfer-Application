import axios from "../utils/axiosInstance";

export const registerUser = async (formData) => {
  const res = await axios.post("/auth/register", formData);
  return res.data;
};

export const loginUser = async (formData) => {
  const res = await axios.post("/auth/login", formData);
  return res.data;
};

export const getProfile = async () => {
  const res = await axios.get("/auth/profile");
  return res.data;
};
