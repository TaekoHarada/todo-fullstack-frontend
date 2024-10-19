import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // This ensures cookies are included
});
console.log("axiosInstance", axiosInstance);
export default axiosInstance;
