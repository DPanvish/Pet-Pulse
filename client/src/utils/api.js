import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://pet-pulse-3bma.onrender.com/api",
    timeout: 20000,
    withCredentials: true,
});

// Automatically attach the token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
