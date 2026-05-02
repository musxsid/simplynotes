import axios from "axios";

// 🔥 Base URLs
const NOTES_API = "http://localhost:8080/api/notes";
const AUTH_API = "http://localhost:8080/api/auth";

// 🔥 Helper to get token
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
  return axios.get(NOTES_API, getAuthHeaders());
};

export const createNote = (data) => {
  return axios.post(NOTES_API, data, getAuthHeaders());
};

export const updateNote = (id, data) => {
  return axios.put(`${NOTES_API}/${id}`, data, getAuthHeaders());
};

export const deleteNote = (id) => {
  return axios.delete(`${NOTES_API}/${id}`, getAuthHeaders());
};

// ================= AUTH =================

export const login = (data) => {
  return axios.post(`${AUTH_API}/login`, data);
};

export const signup = (data) => {
  return axios.post(`${AUTH_API}/register`, data);
};