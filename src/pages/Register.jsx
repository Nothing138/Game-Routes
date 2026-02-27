import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, ShieldCheck, ArrowRight, Loader2, MailQuestion, CheckCircle } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ full_name: '', email: '', password: '', otp: '' });
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(0); // OTP resend timer
    const navigate = useNavigate();

    // Timer Logic for Resend OTP
    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    // 1. Function to Send OTP
    const handleSendOtp = async () => {
        if (!formData.email || !formData.full_name) {
            return Swal.fire('Error', 'Please enter Name and Email first!', 'error');
        }
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/verify/send-otp', { email: formData.email });
            if (res.data.success) {
                setIsOtpSent(true);
                setTimer(60); // 60 seconds wait for resend
                Swal.fire('Sent!', 'Check your email for the 6-digit code.', 'success');
            }
        } catch (err) {
            Swal.fire('Failed', err.response?.data?.message || 'Failed to send OTP', 'error');
        } finally {
            setLoading(false);
        }
    };

    // 2. Final Registration
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isOtpSent) return Swal.fire('Wait!', 'Please verify your email with OTP first.', 'warning');
        
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/verify/register', formData);
            if (res.data.success) {
                Swal.fire({ icon: 'success', title: 'Registration Successful!', timer: 2000, showConfirmButton: false });
                setTimeout(() => navigate('/login'), 2000); 
            }
        } catch (err) {
            Swal.fire('Error', err.response?.data?.message || 'Verification failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0f172a] p-4 font-sans">
            <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl w-full bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-100 dark:border-slate-800"
            >
                {/* --- Left Side: Visuals --- */}
                <div className="md:w-[40%] bg-blue-600 p-10 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-700 opacity-90"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6 backdrop-blur-md">
                            <ShieldCheck size={28} />
                        </div>
                        <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-tight">
                            Secure <br /> Registration
                        </h2>
                        <p className="mt-4 text-blue-100 font-medium">Verified accounts ensure a safe community for all travelers and recruiters.</p>
                    </div>

                    <div className="relative z-10 mt-10 space-y-3">
                        <div className="flex items-center gap-3 bg-black/10 p-4 rounded-2xl border border-white/10">
                            <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-xs font-bold">1</div>
                            <span className="text-xs font-bold uppercase tracking-widest">Enter Details</span>
                        </div>
                        <div className="flex items-center gap-3 bg-black/10 p-4 rounded-2xl border border-white/10 opacity-60">
                            <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-xs font-bold">2</div>
                            <span className="text-xs font-bold uppercase tracking-widest">Verify Email (OTP)</span>
                        </div>
                    </div>
                </div>

                {/* --- Right Side: Form --- */}
                <div className="md:w-[60%] p-8 md:p-14">
                    <div className="mb-8">
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight">Join Game Routes</h1>
                        <p className="text-slate-500 font-medium text-sm">Please verify your identity to proceed.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input required type="text" placeholder="John Doe" 
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-blue-600 outline-none dark:text-white transition-all"
                                        onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input required type="email" placeholder="john@example.com" 
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-blue-600 outline-none dark:text-white transition-all"
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input required type="password" placeholder="••••••••" 
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-blue-600 outline-none dark:text-white transition-all"
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                />
                            </div>
                        </div>

                        {/* OTP SECTION */}
                        <AnimatePresence>
                            {isOtpSent && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="space-y-2 pt-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-blue-600 ml-1 italic">Enter 6-Digit OTP</label>
                                    <div className="relative">
                                        <MailQuestion className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" size={18} />
                                        <input required type="text" maxLength="6" placeholder="000000" 
                                            className="w-full pl-12 pr-4 py-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none dark:text-white font-black tracking-[0.5em] text-lg"
                                            onChange={(e) => setFormData({...formData, otp: e.target.value})}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* BUTTONS */}
                        <div className="pt-4 flex flex-col gap-3">
                            {!isOtpSent ? (
                                <button type="button" onClick={handleSendOtp} disabled={loading}
                                    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-200 dark:shadow-none hover:bg-blue-700 transition-all flex items-center justify-center gap-3"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : 'Get Verification Code'}
                                </button>
                            ) : (
                                <>
                                    <button type="submit" disabled={loading}
                                        className="w-full bg-slate-900 dark:bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3"
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : 'Verify & Register Account'} <ArrowRight size={18} />
                                    </button>
                                    <button type="button" onClick={handleSendOtp} disabled={timer > 0 || loading}
                                        className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors disabled:opacity-50"
                                    >
                                        {timer > 0 ? `Resend OTP in ${timer}s` : "Didn't get code? Resend Now"}
                                    </button>
                                </>
                            )}
                        </div>
                    </form>

                    <p className="text-center mt-10 text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Joined before? <Link to="/login" className="text-blue-600 hover:underline">Sign In Instead</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;