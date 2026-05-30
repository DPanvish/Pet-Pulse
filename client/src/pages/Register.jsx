import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
// Added Store, MapPin, and Phone icons
import { PawPrint, Mail, Lock, User, KeyRound, Loader2, Store, MapPin, Phone } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({name: '', email: '', password: '', otp: '', shopName: '', phone: '', address: '' });
    
    const { requestRegisterMutation, verifyRegisterMutation } = useAuth();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleRequestOtp = (e) => {
        e.preventDefault();
        requestRegisterMutation.mutate(
            { email: formData.email },
            { onSuccess: () => setStep(2) }
        );
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        verifyRegisterMutation.mutate({ 
            name: formData.name,
            email: formData.email, 
            password: formData.password, 
            phone: formData.phone,
            shopName: formData.shopName,
            address: formData.address,
            otp: formData.otp 
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

                {(requestRegisterMutation.isError || verifyRegisterMutation.isError) && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                        className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3.5 rounded-xl mb-6 text-center backdrop-blur-md"
                    >
                        {requestRegisterMutation.error?.response?.data?.msg || verifyRegisterMutation.error?.response?.data?.msg || 'An error occurred.'}
                    </motion.div>
                )}

                <div className="relative">
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.form 
                                key="step1"
                                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}
                                onSubmit={handleRequestOtp} className="space-y-4"
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
                                    <button type="submit" disabled={requestRegisterMutation.isPending} className="btn-primary inner-highlight w-full">
                                        {requestRegisterMutation.isPending ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Send Verification OTP'}
                                    </button>
                                </div>
                            </motion.form>
                        ) : (
                            <motion.form 
                                key="step2"
                                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}
                                onSubmit={handleVerifyOtp} className="space-y-5 text-center"
                            >
                                <p className="text-muted text-sm mb-4">
                                    We sent a 6-digit code to <br/>
                                    <span className="text-foreground font-medium">{formData.email}</span>
                                </p>
                                
                                <div className="relative group">
                                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-brand-400 transition-colors" size={18} />
                                    <input 
                                        name="otp" type="text" required placeholder="000000" maxLength={6} 
                                        value={formData.otp} onChange={handleChange} 
                                        className="input-field text-center tracking-[0.5em] font-mono text-lg pl-10" 
                                    />
                                </div>
                                
                                <div className="pt-3">
                                    <button type="submit" disabled={verifyRegisterMutation.isPending} className="btn-primary inner-highlight w-full">
                                        {verifyRegisterMutation.isPending ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Verify & Launch Dashboard'}
                                    </button>
                                </div>
                                
                                <button type="button" onClick={() => setStep(1)} className="text-muted text-sm mt-4 hover:text-brand-400 transition-colors font-medium">
                                    ← Back to details
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>

                {step === 1 && (
                    <p className="text-center text-muted mt-8 text-sm font-medium">
                        Already have a store? <Link to="/login" className="text-brand-400 hover:text-brand-300 transition-colors">Sign in</Link>
                    </p>
                )}
            </div>
        </div>
    );
};

export default Register;