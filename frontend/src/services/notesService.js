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
  return axios.get(`${API}/notes`, getAuthHeaders());
};

export const getNoteById = (id) => {
  return axios.get(`${API}/notes/${id}`, getAuthHeaders());
};

export const createNote = (data) => {
  return axios.post(`${API}/notes`, data, getAuthHeaders());
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