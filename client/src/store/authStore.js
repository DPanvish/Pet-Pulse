import { create } from "zustand";

const getStoredUser = () => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser || storedUser === "undefined") {
        localStorage.removeItem("user");
        return null;
    }

    try {
        return JSON.parse(storedUser);
    } catch {
        localStorage.removeItem("user");
        return null;
    }
};

export const useAuthStore = create((set) => ({
    user: getStoredUser(),
    token: localStorage.getItem("token") || null,

    login: (userData, token) => {
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", token);
        set({ user: userData, token });
    },
    logout: () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        set({ user: null, token: null });
    }
}))
