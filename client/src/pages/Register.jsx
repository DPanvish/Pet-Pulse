import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PawPrint, Mail, Lock, User, KeyRound, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', otp: '' });
    
    const { requestRegisterMutation, verifyRegisterMutation } = useAuth();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // Request OTP
    const handleRequestOtp = (e) => {
        e.preventDefault();
        requestRegisterMutation.mutate(
            { name: formData.name, email: formData.email, password: formData.password },
            { onSuccess: () => setStep(2) } // Slide to OTP screen on success
        );
    };

    // Verify OTP
    const handleVerifyOtp = (e) => {
        e.preventDefault();
        verifyRegisterMutation.mutate({ 
            email: formData.email, 
            password: formData.password, 
            otp: formData.otp 
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="glass-panel p-8 rounded-3xl w-full max-w-md relative z-10 neon-glow overflow-hidden">
                <div className="flex flex-col items-center mb-6">
                    <div className="w-16 h-16 bg-brand-500/20 text-brand-400 rounded-2xl flex items-center justify-center mb-4">
                        <PawPrint size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Create Store</h2>
                </div>

                {/* Display Errors for either step */}
                {(requestRegisterMutation.isError || verifyRegisterMutation.isError) && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-xl mb-4 text-center">
                        {requestRegisterMutation.error?.response?.data?.msg || verifyRegisterMutation.error?.response?.data?.msg || 'An error occurred.'}
                    </div>
                )}

                <div className="relative">
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.form 
                                key="step1"
                                initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}
                                onSubmit={handleRequestOtp} className="space-y-4"
                            >
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                                    <input name="name" type="text" required placeholder="Owner Name" value={formData.name} onChange={handleChange} className="input-field" />
                                </div>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                                    <input name="email" type="email" required placeholder="Email Address" value={formData.email} onChange={handleChange} className="input-field" />
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                                    <input name="password" type="password" required placeholder="Secure Password" value={formData.password} onChange={handleChange} className="input-field" />
                                </div>
                                <button type="submit" disabled={requestRegisterMutation.isPending} className="w-full bg-brand-500 hover:bg-brand-400 text-dark-950 font-bold py-3 rounded-xl transition-colors mt-2">
                                    {requestRegisterMutation.isPending ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Send Verification OTP'}
                                </button>
                            </motion.form>
                        ) : (
                            <motion.form 
                                key="step2"
                                initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}
                                onSubmit={handleVerifyOtp} className="space-y-4 text-center"
                            >
                                <p className="text-neutral-400 text-sm mb-4">We sent a 6-digit code to <span className="text-white font-medium">{formData.email}</span></p>
                                <div className="relative">
                                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                                    <input name="otp" type="text" required placeholder="Enter OTP" maxLength={6} value={formData.otp} onChange={handleChange} className="input-field text-center tracking-widest font-mono text-lg" />
                                </div>
                                <button type="submit" disabled={verifyRegisterMutation.isPending} className="w-full bg-brand-500 hover:bg-brand-400 text-dark-950 font-bold py-3 rounded-xl transition-colors mt-2">
                                    {verifyRegisterMutation.isPending ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Verify & Launch Dashboard'}
                                </button>
                                <button type="button" onClick={() => setStep(1)} className="text-neutral-500 text-sm mt-4 hover:text-white transition-colors">
                                    ← Back to details
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>

                {step === 1 && (
                    <p className="text-center text-neutral-500 mt-6 text-sm">
                        Already have a store? <Link to="/login" className="text-brand-400 hover:text-brand-300">Sign in</Link>
                    </p>
                )}
            </div>
        </div>
    );
};

export default Register;