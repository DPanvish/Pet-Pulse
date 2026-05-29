import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';

export const useAnalytics = (timeRange = 'month') => {
    const dashboardQuery = useQuery({
        // Adding timeRange to the queryKey means it auto-refetches when the range changes!
        queryKey: ['analytics', 'dashboard', timeRange],
        queryFn: async () => {
            const { data } = await api.get('/analytics/dashboard', {
                params: { range: timeRange } // Sent to backend as ?range=week
            });
            return data;
        },
        placeholderData: (prev) => prev, // Prevents UI flickering while loading new data
    });

    const topProductsQuery = useQuery({
        queryKey: ['analytics', 'top-products', timeRange],
        queryFn: async () => {
            const { data } = await api.get('/analytics/top-products', {
                params: { range: timeRange }
            });
            return data;
        },
        placeholderData: (prev) => prev,
    });

    return {
        dashboard: dashboardQuery.data,
        topProducts: topProductsQuery.data,
        isLoading: dashboardQuery.isLoading || topProductsQuery.isLoading,
        isError: dashboardQuery.isError || topProductsQuery.isError,
    };
};