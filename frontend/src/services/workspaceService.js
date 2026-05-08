import axios from "axios";

const API = "http://localhost:8080/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getWorkspaces = () => {
  return axios.get(`${API}/workspaces`, getAuthHeaders());
};

export const createWorkspace = (data) => {
  return axios.post(`${API}/workspaces`, data, getAuthHeaders());
};

export const updateWorkspace = (id, data) => {
  return axios.put(`${API}/workspaces/${id}`, data, getAuthHeaders());
};

// Delete a workspace completely
export const deleteWorkspace = (id) => {
  return axios.delete(`${API}/workspaces/${id}`, getAuthHeaders());
};

// Added specifically for Workspace Cover Images
export const uploadWorkspaceCover = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  // Reusing the same endpoint we built for the note images!
  return axios.post(`${API}/upload/image`, formData, getAuthHeaders());
};