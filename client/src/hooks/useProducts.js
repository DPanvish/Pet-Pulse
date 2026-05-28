import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';

export const useGetProducts = (search = '', category = '') => {
    return useQuery({
        queryKey: ['products', search, category], 
        queryFn: async () => {
            const { data } = await api.get('/products', {
                params: { search, category }
            });
            return data;
        },
    });
};

export const useCreateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData) => {
            const { data } = await api.post('/products', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        }
    });
};