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

            // 🚀 Redirect Logic
            if (['superadmin', 'editor', 'hr_manager', 'moderator'].includes(res.data.role)) {
                navigate('/admin/dashboard');
            } else if (res.data.role === 'recruiter') {
                navigate('/recruiter/dashboard'); // Jodi Recruiter Dashboard alada thake
            } else {
                navigate('/');
            }

            Swal.fire({ icon: 'success', title: 'Logged In!', showConfirmButton: false, timer: 1500 });
        } catch (err) {
            Swal.fire('Error', err.response?.data?.message || 'Login Failed', 'error');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <h2 className="text-3xl font-bold text-center text-slate-900 mb-6">Welcome Back</h2>
                <form className="space-y-4" onSubmit={handleLogin}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input 
                            type="email" 
                            className="w-full mt-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                            placeholder="name@company.com" 
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input 
                            type="password" 
                            className="w-full mt-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                            placeholder="••••••••" 
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all">
                        Login to JM-IT
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;