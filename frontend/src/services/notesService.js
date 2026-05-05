import axios from "axios";

// ✅ FIX: always point to backend
const API = "http://localhost:8080/api";

// 🔐 Auth header
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ================= NOTES =================

export const getNotes = () => {
  const workspaceId = localStorage.getItem("activeWorkspaceId");
  // This automatically adds ?workspaceId=123 to your GET request
  return axios.get(`${API}/notes`, {
    ...getAuthHeaders(),
    params: { workspaceId } 
  });
};

export const getNoteById = (id) => {
  return axios.get(`${API}/notes/${id}`, getAuthHeaders());
};

export const createNote = (data) => {
  const workspaceId = localStorage.getItem("activeWorkspaceId");
  // This ensures workspaceId hits your backend's @RequestParam
  return axios.post(`${API}/notes`, data, {
    ...getAuthHeaders(),
    params: { workspaceId } 
  });
};

export const updateNote = (id, data) => {
  return axios.put(`${API}/notes/${id}`, data, getAuthHeaders());
};

export const deleteNote = (id) => {
  return axios.delete(`${API}/notes/${id}`, getAuthHeaders());
};

// ================= AUTH =================

export const login = (data) => {
  return axios.post(`${API}/auth/login`, data);
};

export const signup = (data) => {
  return axios.post(`${API}/auth/register`, data);
};