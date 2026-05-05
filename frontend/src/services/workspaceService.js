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