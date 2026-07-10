import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const TOKEN_KEY = "resolveai_token";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }
    return Promise.reject(error);
  }
);

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const clearAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);

export const loginUser = (credentials) => api.post("/api/auth/login", credentials);
export const getCustomers = () => api.get("/api/customers");
export const getTickets = () => api.get("/api/tickets");
export const getConversations = () => api.get("/api/conversations");
export const processAI = (payload) => api.post("/api/ai/process", payload);
export const getAIHealth = () => api.get("/api/ai/health");
export const getAIMetrics = () => api.get("/api/ai/metrics");
export const getAILogs = () => api.get("/api/ai/logs");

export default api;
