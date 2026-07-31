import axios from "axios";

const API = "https://ai-interview-prep-generator-backend.onrender.com/api/auth"; 

export async function register({ username, email, password }) {
  try {
    const res = await axios.post(
      `${API}/register`,
      {
        username,
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );

    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function login({ email, password }) {
  try {
    const res = await axios.post(
      `${API}/login`,
      {
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );

    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function logout() {
  try {
    const res = await axios.post(
      `${API}/logout`,
      {},
      {
        withCredentials: true,
      }
    );

    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getMe() {
  try {
    const res = await axios.get(`${API}/get-me`, {
      withCredentials: true,
    });

    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}