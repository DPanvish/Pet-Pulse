import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PawPrint, Mail, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // Pull the mutation from our custom hook
    const { loginMutation } = useAuth();

    const handleLogin = (e) => {
        e.preventDefault();
        loginMutation.mutate({ email, password });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/10 blur-[120px] rounded-full pointer-events-none" />

            <motion.div 
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                className="glass-panel p-8 rounded-3xl w-full max-w-md relative z-10 neon-glow"
            >
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-brand-500/20 text-brand-400 rounded-2xl flex items-center justify-center mb-4">
                        <PawPrint size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-white">PetPulse</h2>
                    <p className="text-neutral-400 mt-2 text-sm">Welcome back, Owner.</p>
                </div>

                {loginMutation.isError && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-xl mb-6 text-center animate-fade-in">
                        {loginMutation.error.response?.data?.msg || 'Login failed.'}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                        <input 
                            type="email" required placeholder="Email Address"
                            value={email} onChange={(e) => setEmail(e.target.value)}
                            className="input-field"
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                        <input 
                            type="password" required placeholder="Password"
                            value={password} onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                        />
                    </div>

                    <button 
                        type="submit" disabled={loginMutation.isPending}
                        className="w-full bg-brand-500 hover:bg-brand-400 text-dark-950 font-bold py-3 rounded-xl transition-colors flex items-center justify-center disabled:opacity-70"
                    >
                        {loginMutation.isPending ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
                    </button>
                </form>

                <p className="text-center text-neutral-500 mt-6 text-sm">
                    Don't have a store account? <Link to="/register" className="text-brand-400 hover:text-brand-300 transition-colors">Register here</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;