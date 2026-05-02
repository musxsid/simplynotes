import axios from "axios";

const API = "http://localhost:8080/api/notes";

export const getNotes = async () => {
  const token = localStorage.getItem("token");

  return axios.get(API, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createNote = async (data) => {
  const token = localStorage.getItem("token");

  return axios.post(API, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateNote = async (id, data) => {
  const token = localStorage.getItem("token");

  return axios.put(`${API}/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteNote = async (id) => {
  const token = localStorage.getItem("token");

  return axios.delete(`${API}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};