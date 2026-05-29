import { useQuery } from '@tanstack/react-query';
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