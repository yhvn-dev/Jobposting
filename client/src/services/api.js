import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const signup = async (name, email, password, recaptchaToken) => {
  const response = await api.post("/auth/signup", {
    name,
    email,
    password,
    recaptchaToken,
  });
  return response.data;
};

export const login = async (email, password, recaptchaToken) => {
  const response = await api.post("/auth/login", {
    email,
    password,
    recaptchaToken,
  });
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

export const resetPassword = async (token, newPassword) => {
  const response = await api.post("/auth/reset-password", {
    token,
    newPassword,
  });
  return response.data;
};

export const verifyToken = async () => {
  const response = await api.get("/auth/verify");
  return response.data;
};

export const verifyLoginCode = async (loginToken, code) => {
  const response = await api.post("/auth/verify-email", { loginToken, code });
  return response.data;
};

export const resendVerification = async (loginToken) => {
  const response = await api.post("/auth/resend-verification", { loginToken });
  return response.data;
};

export default api;
