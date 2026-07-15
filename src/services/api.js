import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const TOKEN_KEY = "resolveai_token";

const api = axios.create({ baseURL: API_BASE_URL, timeout: 10000, headers: { "Content-Type": "application/json" } });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use((response) => response, (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem(TOKEN_KEY);
    if (window.location.pathname !== "/login") window.location.assign("/login");
  }
  return Promise.reject(error);
});

export const setAuthToken = (token) => { if (token) localStorage.setItem(TOKEN_KEY, token); else localStorage.removeItem(TOKEN_KEY); };
export const clearAuthToken = () => localStorage.removeItem(TOKEN_KEY);
export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);

export const loginUser = (credentials) => api.post("/api/auth/login", credentials);
export const registerUser = (payload) => api.post("/api/auth/register", payload);
export const getMe = () => api.get("/api/auth/me");
export const getCustomers = () => api.get("/api/customers");
export const getTickets = () => api.get("/api/tickets");
export const getConversations = () => api.get("/api/conversations");
export const createTicket = (payload) => api.post("/api/tickets", payload);
export const getTicketById = (id) => api.get(`/api/tickets/${id}`);
export const updateTicket = (id, payload) => api.put(`/api/tickets/${id}`, payload);
export const processAI = (payload) => api.post("/api/ai/process", payload);
export const getAIHealth = () => api.get("/api/ai/health");
export const getAIMetrics = () => api.get("/api/ai/metrics");
export const getAILogs = () => api.get("/api/ai/logs");
export const getAIState = (workflowId) => workflowId ? api.get(`/api/ai/state/${workflowId}`) : api.get("/api/ai/state");
export const getAIMonitor = () => api.get("/api/ai/monitor");
export const getAnalytics = () => api.get("/api/analytics");
export const getLogs = () => api.get("/api/logs");
export const getKnowledgeDocuments = () => api.get("/api/knowledge");
export const uploadKnowledgeDocument = (formData) => api.post("/api/knowledge/upload", formData, { headers: { "Content-Type": "multipart/form-data" } });
export const deleteKnowledgeDocument = (id) => api.delete(`/api/knowledge/${id}`);
export const retrieveKnowledge = (query) => api.post("/api/knowledge/retrieve", { query });
export const getKnowledgeMonitor = () => api.get("/api/knowledge/monitor");

export default api;
