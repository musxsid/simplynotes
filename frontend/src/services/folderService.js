import axios from "axios";

const API = "http://localhost:8080/api/folders";

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getFolders = () => axios.get(API, getAuthHeader());