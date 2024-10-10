import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5001",
  withCredentials: true, // This ensures cookies are included
});
console.log("axiosInstance", axiosInstance);
export default axiosInstance;
