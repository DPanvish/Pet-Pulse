import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';

export const useCheckout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (saleData) => {
            const { data } = await api.post('/sales', saleData);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['analytics'] });
        }
    });
};