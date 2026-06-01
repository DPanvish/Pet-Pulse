import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PawPrint, Mail, Lock, User, Loader2, Store, MapPin, Phone } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', shopName: '', phone: '', address: '' });
    const { registerMutation } = useAuth();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleRegister = (e) => {
        e.preventDefault();
        registerMutation.mutate({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            shopName: formData.shopName,
            address: formData.address
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-brand-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob pointer-events-none" />
            <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-purple-600/10 rounded-full mix-blend-screen filter blur-[100px] animate-blob pointer-events-none" style={{ animationDelay: '2s' }} />

            <div className="glass-panel inner-highlight premium-glow p-10 rounded-3xl w-full max-w-lg relative z-10 overflow-hidden">
                <div className="flex flex-col items-center mb-8">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}
                        className="w-14 h-14 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-2xl flex items-center justify-center mb-5 shadow-[inset_0_0_20px_rgba(99,102,241,0.1)]"
                    >
                        <PawPrint size={28} />
                    </motion.div>
                    <h2 className="text-3xl font-bold text-foreground tracking-tight">Create Store</h2>
                </div>

                {registerMutation.isError && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                        className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3.5 rounded-xl mb-6 text-center backdrop-blur-md"
                    >
                        {registerMutation.error?.response?.data?.msg || 'An error occurred.'}
                    </motion.div>
                )}

                <motion.form
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}
                    onSubmit={handleRegister} className="space-y-4"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-brand-400 transition-colors" size={18} />
                            <input name="name" type="text" required placeholder="Owner Name" value={formData.name} onChange={handleChange} className="input-field pl-10" />
                        </div>
                        <div className="relative group">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-brand-400 transition-colors" size={18} />
                            <input name="phone" type="tel" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="input-field pl-10" />
                        </div>
                    </div>

                    <div className="relative group">
                        <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-brand-400 transition-colors" size={18} />
                        <input name="shopName" type="text" required placeholder="Shop Name (e.g. PetPulse Hub)" value={formData.shopName} onChange={handleChange} className="input-field pl-10" />
                    </div>

                    <div className="relative group">
                        <MapPin className="absolute left-4 top-4 text-muted group-focus-within:text-brand-400 transition-colors" size={18} />
                        <textarea name="address" required placeholder="Complete Store Address" value={formData.address} onChange={handleChange} className="input-field pl-10 py-3 resize-none h-20" />
                    </div>

                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-brand-400 transition-colors" size={18} />
                        <input name="email" type="email" required placeholder="Email Address" value={formData.email} onChange={handleChange} className="input-field pl-10" />
                    </div>

                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-brand-400 transition-colors" size={18} />
                        <input name="password" type="password" minLength={6} required placeholder="Secure Password" value={formData.password} onChange={handleChange} className="input-field pl-10" />
                    </div>

                    <div className="pt-3">
                        <button type="submit" disabled={registerMutation.isPending} className="btn-primary inner-highlight w-full">
                            {registerMutation.isPending ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Create Store'}
                        </button>
                    </div>
                </motion.form>

                <p className="text-center text-muted mt-8 text-sm font-medium">
                    Already have a store? <Link to="/login" className="text-brand-400 hover:text-brand-300 transition-colors">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
