import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';

export const useProducts = (search = '', category = '') => {
    return useQuery({
        queryKey: ['products', search, category],
        queryFn: async () => {
            const { data } = await api.get('/products', {
                params: { search, category }
            });
            return data;
        },
        placeholderData: (previousData) => previousData,
    });
};

export const useCreateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData) => {
            // We use formData because we are uploading an image file
            const { data } = await api.post('/products', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return data;
        },
        onSuccess: () => {
            // Instantly refresh the inventory table!
            queryClient.invalidateQueries({ queryKey: ['products'] });
        }
    });
};