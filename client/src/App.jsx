import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

const Login = () => <div className="p-10 text-white">Login Page</div>;
const Dashboard = () => <div className="p-10 text-white">Dashboard</div>;

const ProtectedRoute = ({ children }) => {
    const { token } = useAuthStore();
    return token ? children : <Navigate to="/login" />;
};

const App = () => {
    return (
        <div className="min-h-screen bg-neutral-950 font-sans">
            <Router>
                <Routes>
                    {/* Public Route */}
                    <Route path="/login" element={<Login />} />

                    {/* Protected Routes */}
                    <Route path="/" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />
                </Routes>
            </Router>
        </div>
    );
}

export default App