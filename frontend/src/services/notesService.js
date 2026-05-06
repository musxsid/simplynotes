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

export const toggleFavoriteNote = (id) => {
  return axios.put(`${API}/notes/${id}/favorite`, {}, getAuthHeaders());
};

export const moveNoteToFolder = (noteId, folderId) => {
  const targetFolderId = folderId === null ? 0 : folderId; 
  return axios.put(`${API}/notes/${noteId}/folder/${targetFolderId}`, {}, getAuthHeaders());
};

// 🔥 NEW: Toggle Public Sharing
export const toggleShareNote = (id) => {
  return axios.put(`${API}/notes/${id}/share`, {}, getAuthHeaders());
};

// 🔥 NEW: Fetch a Public Note (NO AUTH REQUIRED!)
export const getPublicNote = (shareToken) => {
  return axios.get(`${API}/notes/public/${shareToken}`);
};

// ================= AUTH =================

export const login = (data) => {
  return axios.post(`${API}/auth/login`, data);
};

export const signup = (data) => {
  return axios.post(`${API}/auth/register`, data);
};

// ⭐ UPLOAD IMAGE
export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return axios.post(`${API}/upload/image`, formData, getAuthHeaders());
};