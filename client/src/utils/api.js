import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.MODE === 'production' ? import.meta.env.BASE_URL : 'http://localhost:5000/api',
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