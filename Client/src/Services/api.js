import axios from "axios";

// Automatically use the Vercel backend URL if defined in environment variables,
// otherwise default to localhost for local development.
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

export default API;