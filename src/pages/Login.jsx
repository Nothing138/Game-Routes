import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            
            // 💾 Token ar Role save kora
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.role);

            // 🚀 Unified Redirect Logic
            const staffRoles = ['superadmin', 'admin', 'hr_manager', 'moderator', 'recruiter'];
            
            if (staffRoles.includes(res.data.role)) {
                // Sobai ekhon ek dashboard-e jabe
                navigate('/admin/dashboard'); 
            } else {
                // Normal user hole home page-e jabe
                navigate('/');
            }

            Swal.fire({ icon: 'success', title: 'Logged In!', showConfirmButton: false, timer: 1500 });
        } catch (err) {
            Swal.fire('Error', err.response?.data?.message || 'Login Failed', 'error');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl border border-gray-100">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-black text-slate-900 italic tracking-tighter">GAME ROUTES</h2>
                    <p className="text-gray-500 font-medium uppercase text-[10px] tracking-widest mt-2">Management Portal</p>
                </div>
                
                <form className="space-y-5" onSubmit={handleLogin}>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2 ml-1">Email Address</label>
                        <input 
                            type="email" 
                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:bg-white outline-none transition-all" 
                            placeholder="name@gameroutes.com" 
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2 ml-1">Password</label>
                        <input 
                            type="password" 
                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:bg-white outline-none transition-all" 
                            placeholder="••••••••" 
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-red-600 text-white py-4 rounded-2xl font-black uppercase italic tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-200">
                        Enter Workspace
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;