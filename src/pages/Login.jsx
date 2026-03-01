import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, ShieldCheck, Sparkles, UserPlus, HelpCircle } from 'lucide-react';
import Swal from 'sweetalert2';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const navigate = useNavigate();

    // 🛡️ Client-side validation logic (Real-time)
    useEffect(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmailValid = emailRegex.test(email);
        const isPasswordValid = password.length >= 6;
        setIsValid(isEmailValid && isPasswordValid);
    }, [email, password]);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!isValid) return; 

        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            
            // 💾 Storing Auth Data
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.role);
            
            const userData = {
                name: res.data.name || email.split('@')[0],
                email: email,
                role: res.data.role
            };
            localStorage.setItem('user', JSON.stringify(userData));

            // 🔥 Notify Navbar to update in real-time
            window.dispatchEvent(new Event('authChange'));

            Swal.fire({
                icon: 'success',
                title: 'Access Granted',
                text: 'Welcome to Game Routes Workspace!',
                showConfirmButton: false,
                timer: 1500,
                background: '#0f172a',
                color: '#fff'
            });

            setTimeout(() => {
                const staffRoles = ['superadmin', 'admin', 'hr_manager', 'moderator', 'recruiter'];
                if (staffRoles.includes(res.data.role)) {
                    navigate('/admin/dashboard'); 
                } else {
                    navigate('/');
                }
            }, 1000);

        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Access Denied',
                text: err.response?.data?.message || 'Invalid email or password',
                confirmButtonColor: '#ef4444',
                background: '#0f172a',
                color: '#fff'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center px-4 overflow-hidden relative">
            {/* ✨ Premium Animated Backgrounds */}
            <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-blue-600/20 blur-[130px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-red-600/10 blur-[130px] rounded-full" />

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-[450px] z-10"
            >
                {/* 🛡️ Login Glassmorphism Card */}
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 lg:p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
                    
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-red-600" />

                    <div className="text-center mb-10">
                        <motion.div 
                            initial={{ y: -20 }}
                            animate={{ y: 0 }}
                            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl mb-6 shadow-lg shadow-blue-500/30"
                        >
                            <ShieldCheck size={32} className="text-white" />
                        </motion.div>
                        <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">
                            Game<span className="text-blue-500">Routes</span>
                        </h2>
                        <div className="flex items-center justify-center gap-2 mt-3">
                            <Sparkles size={12} className="text-yellow-400" />
                            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Official Access Portal</p>
                        </div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Identity</label>
                            <div className="relative group">
                                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${email ? 'text-blue-500' : 'text-slate-500'}`} size={20} />
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@gameroutes.com"
                                    className="w-full pl-12 pr-6 py-4 bg-slate-900/60 border border-white/5 rounded-2xl text-white outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-600 font-medium"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secure Key</label>
                                {/* ✅ Forgot Password Route */}
                                <Link to="/forgot-password" title="Recover Account" className="text-blue-500 hover:text-blue-400 text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-1 group">
                                    <HelpCircle size={10} className="group-hover:rotate-12 transition-transform" /> Forgot?
                                </Link>
                            </div>
                            <div className="relative group">
                                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${password.length >= 6 ? 'text-blue-500' : 'text-slate-500'}`} size={20} />
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-6 py-4 bg-slate-900/60 border border-white/5 rounded-2xl text-white outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-600 font-medium"
                                    required
                                />
                            </div>
                        </div>

                        {/* Login Button with Dynamic State */}
                        <motion.button 
                            whileHover={isValid ? { scale: 1.02, y: -2 } : {}}
                            whileTap={isValid ? { scale: 0.98 } : {}}
                            type="submit" 
                            disabled={!isValid || loading}
                            className={`w-full group relative py-4 rounded-2xl font-black uppercase italic tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 overflow-hidden
                                ${!isValid 
                                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed opacity-40' 
                                    : loading 
                                        ? 'bg-blue-800 text-white cursor-wait' 
                                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/25'}`}
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>{isValid ? 'Enter Workspace' : 'Credentials Required'}</span>
                                    <ArrowRight size={18} className={`${isValid ? 'group-hover:translate-x-1' : ''} transition-transform duration-300`} />
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Registration Footer */}
                    <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center gap-4">
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">New to the platform?</p>
                        <Link 
                            to="/register" 
                            className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-[11px] font-black uppercase tracking-[0.2em] border border-white/10 transition-all active:scale-95 shadow-lg"
                        >
                            <UserPlus size={14} className="text-blue-500" />
                            Create Account
                        </Link>
                    </div>
                </div>

                {/* Navigation Back */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-center mt-8"
                >
                    <button onClick={() => navigate('/')} className="text-slate-500 hover:text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] transition-colors flex items-center justify-center w-full gap-2">
                        ← Exit to Public Site
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Login;