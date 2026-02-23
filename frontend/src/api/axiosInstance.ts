import axios, { type AxiosInstance } from "axios";

// Create Axios instance
const axiosInstance: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api", // Vite environment variable
    headers: {
        "Content-Type": "application/json",
    },
});

// Optional: Response interceptor for error handling
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API Error:", error);
        return Promise.reject(error);
    }
);

export default axiosInstance;