import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            const role = res.data.user.role;

            // Role onujayi navigation
            if (role === 'admin' || role === 'recruiter') {
                navigate('/admin/dashboard');
            } else {
                Swal.fire('Access Denied', 'You are not authorized!', 'error');
            }
        } catch (err) {
            Swal.fire('Error', 'Invalid Email or Password', 'error');
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-slate-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">Admin Login</h2>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input 
                            type="email" 
                            className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-orange-500 outline-none"
                            placeholder="admin@jmit.com"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input 
                            type="password" 
                            className="w-full p-2 border border-gray-300 rounded mt-1 focus:ring-2 focus:ring-orange-500 outline-none"
                            placeholder="******"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-slate-900 text-white py-2 rounded hover:bg-slate-800 transition shadow-md font-semibold"
                    >
                        Login to Dashboard
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;