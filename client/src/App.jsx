import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes before refetching
            retry: 1, // Only retry failed requests once
            refetchOnWindowFocus: false, // Don't refetch every time the user switches browser tabs
        },
    },
});

const Inventory = () => <div className="animate-fade-in"><h1 className="text-3xl font-bold text-foreground">Inventory Management</h1></div>;
const POS = () => <div className="animate-fade-in"><h1 className="text-3xl font-bold text-foreground">Point of Sale</h1></div>;

const ProtectedRoute = ({ children }) => {
    const { token } = useAuthStore();
    return token ? children : <Navigate to="/login" />;
};

const App = () => {
    const initTheme = useThemeStore((state) => state.initTheme);

    useEffect(() => {
        initTheme();
    }, [initTheme]);
    
    return (
        <QueryClientProvider client={queryClient}>
            <div className="min-h-screen bg-neutral-950 font-sans text-neutral-200">
                <Router>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/" element={
                            <ProtectedRoute>
                                <DashboardLayout />
                            </ProtectedRoute>
                        }>
                            {/* The <Outlet /> in DashboardLayout will render these based on the URL */}
                            <Route index element={<Dashboard />} />
                            <Route path="inventory" element={<Inventory />} />
                            <Route path="pos" element={<POS />} />
                        </Route>
                    </Routes>
                </Router>
            </div>
            
            {/* Creates a toggleable button in the bottom right for debugging cached data */}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}

export default App
