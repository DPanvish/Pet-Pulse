import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../utils/api';

export const useAuth = () => {
    const navigate = useNavigate();
    const loginAction = useAuthStore((state) => state.login);

    const loginMutation = useMutation({
        mutationFn: async (credentials) => {
            const { data } = await api.post('/auth/login', credentials);
            return data;
        },
        onSuccess: (data) => {
            loginAction(data.user, data.token);
            navigate('/');
        }
    });

    const registerMutation = useMutation({
        mutationFn: async (userData) => {
            const { data } = await api.post('/auth/register', userData);
            return data;
        },
        onSuccess: (data) => {
            loginAction(data.user, data.token);
            navigate('/');
        }
    });

    return {
        loginMutation,
        registerMutation
    };
};
