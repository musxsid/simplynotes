import axios from "axios";

const API = "http://localhost:8080/api/folders";

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getFolders = () => {
  const workspaceId = localStorage.getItem("activeWorkspaceId");
  return axios.get(API, {
    ...getAuthHeader(),
    params: { workspaceId } 
  });
};

export const deleteFolder = (id) => {
  return axios.delete(`${API}/${id}`, getAuthHeader());
};