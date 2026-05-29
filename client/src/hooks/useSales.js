import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
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

export const useSalesHistory = (timeRange = 'month') => {
    return useQuery({
        queryKey: ['sales', 'history', timeRange],
        queryFn: async () => {
            // Passes the time range to your backend so you only fetch what you need
            const { data } = await api.get('/sales', {
                params: { range: timeRange } 
            });
            return data;
        },
        placeholderData: (prev) => prev,
    });
};