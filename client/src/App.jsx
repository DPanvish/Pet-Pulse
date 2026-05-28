import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import Register from './pages/Register';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes before refetching
            retry: 1, // Only retry failed requests once
            refetchOnWindowFocus: false, // Don't refetch every time the user switches browser tabs
        },
    },
});

const Dashboard = () => (
    <div className="min-h-screen bg-neutral-950 text-white p-10">
        <h1 className="text-3xl font-bold text-emerald-400">Welcome to PetPulse Dashboard</h1>
        <button 
            onClick={() => useAuthStore.getState().logout()} 
            className="mt-4 bg-red-500/20 text-red-400 px-4 py-2 rounded-lg"
        >
            Logout
        </button>
    </div>
);

const ProtectedRoute = ({ children }) => {
    const { token } = useAuthStore();
    return token ? children : <Navigate to="/login" />;
};

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="min-h-screen bg-neutral-950 font-sans text-neutral-200">
                <Router>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/" element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } />
                    </Routes>
                </Router>
            </div>
            
            {/* Creates a toggleable button in the bottom right for debugging cached data */}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}

export default App