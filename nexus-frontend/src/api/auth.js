import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/nexus",
});

// attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const loginUser = (body) => API.post("/auth/login", body);
export const registerUser = (body) => API.post("/api/v1/user", body);
