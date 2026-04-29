import axios from "axios";

export let API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

// Remove trailing slash if present to avoid double slashes with endpoints
if (API_BASE_URL.endsWith("/")) {
  API_BASE_URL = API_BASE_URL.slice(0, -1);
}

// Extract host (e.g., http://localhost) for image paths
export const API_HOST = new URL(API_BASE_URL).origin;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for standard wrapper
apiClient.interceptors.response.use(
  (response) => {
    // If it's a success response, we return the nested data payload directly
    if (response.data && response.data.status === "success") {
      return response.data.data;
    }
    return response;
  },
  (error) => {
    // Extract error message from the standard error wrapper if available
    const message = error.response?.data?.message || error.message;
    const errors = error.response?.data?.errors || [];
    
    const enhancedError = new Error(message);
    enhancedError.status = error.response?.status;
    enhancedError.errors = errors;
    
    return Promise.reject(enhancedError);
  }
);