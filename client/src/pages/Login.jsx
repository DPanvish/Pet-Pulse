import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PawPrint, Mail, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const { loginMutation } = useAuth();

    const handleLogin = (e) => {
        e.preventDefault();
        loginMutation.mutate({ email, password });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
            
            {/* Premium Ambient Background Mesh */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-brand-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob pointer-events-none" />
            <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-purple-600/10 rounded-full mix-blend-screen filter blur-[100px] animate-blob pointer-events-none" style={{ animationDelay: '2s' }} />

            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="glass-panel inner-highlight premium-glow p-10 rounded-3xl w-full max-w-md relative z-10"
            >
                <div className="flex flex-col items-center mb-10">
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}
                        className="w-14 h-14 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-2xl flex items-center justify-center mb-5 shadow-[inset_0_0_20px_rgba(99,102,241,0.1)]"
                    >
                        <PawPrint size={28} />
                    </motion.div>
                    <h2 className="text-3xl font-bold text-foreground tracking-tight">PetPulse</h2>
                    <p className="text-muted mt-2 text-sm font-medium">Owner Portal Login</p>
                </div>

                {loginMutation.isError && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                        className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3.5 rounded-xl mb-6 text-center backdrop-blur-md"
                    >
                        {loginMutation.error.response?.data?.msg || 'Authentication failed.'}
                    </motion.div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-brand-400 transition-colors" size={18} />
                        <input 
                            type="email" required placeholder="Email Address"
                            value={email} onChange={(e) => setEmail(e.target.value)}
                            className="input-field"
                        />
                    </div>

                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-brand-400 transition-colors" size={18} />
                        <input 
                            type="password" required placeholder="Password"
                            value={password} onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                        />
                    </div>

                    <div className="pt-2">
                        <button 
                            type="submit" disabled={loginMutation.isPending}
                            className="btn-primary inner-highlight"
                        >
                            {loginMutation.isPending ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
                        </button>
                    </div>
                </form>

                <p className="text-center text-muted mt-8 text-sm font-medium">
                    Don't have a store account?{' '}
                    <Link to="/register" className="text-brand-400 hover:text-brand-300 transition-colors">
                        Register here
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
