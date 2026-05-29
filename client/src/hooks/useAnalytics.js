import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';

export const useAnalytics = () => {
    const dashboardQuery = useQuery({
        queryKey: ['analytics', 'dashboard'],
        queryFn: async () => {
            const { data } = await api.get('/analytics/dashboard');
            return data;
        }
    });

    const topProductsQuery = useQuery({
        queryKey: ['analytics', 'top-products'],
        queryFn: async () => {
            const { data } = await api.get('/analytics/top-products');
            return data;
        }
    });

    return {
        dashboard: dashboardQuery.data,
        topProducts: topProductsQuery.data,
        isLoading: dashboardQuery.isLoading || topProductsQuery.isLoading,
        isError: dashboardQuery.isError || topProductsQuery.isError,
    };
};