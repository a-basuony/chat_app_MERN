import axios from "axios";

// ✅ Automatically set baseURL depending on environment
const baseURL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api" // 🧩 your backend during local dev
    : "/api"; // 🧩 relative path for production (same domain)

const api = axios.create({
  baseURL,
  withCredentials: true, // send cookies (if using cookie-based auth)
});
export default api;