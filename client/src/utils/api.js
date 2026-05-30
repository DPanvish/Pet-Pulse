import axios from "axios";

const api = axios.create({
    baseURL: "https://pet-pulse-3bma.onrender.com/api",
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