import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ManageUsers = () => {
    const [formData, setFormData] = useState({ full_name: '', email: '', password: '', role: 'recruiter' });

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            // Dashboard e login thaka obosthay staff add kora
            await axios.post('http://localhost:5000/api/auth/register', formData);
            Swal.fire('Success', 'New Staff Added!', 'success');
        } catch (err) {
            Swal.fire('Error', 'Could not add staff', 'error');
        }
    };

    return (
        <div className="bg-white p-8 rounded-[30px] shadow-sm border border-gray-100 max-w-lg">
            <h2 className="text-xl font-black italic uppercase mb-6">Add New <span className="text-red-600">Staff/Recruiter</span></h2>
            <form onSubmit={handleAddUser} className="space-y-4">
                <input type="text" placeholder="Full Name" className="w-full p-3 bg-gray-50 border rounded-2xl" onChange={(e) => setFormData({...formData, full_name: e.target.value})} required />
                <input type="email" placeholder="Email" className="w-full p-3 bg-gray-50 border rounded-2xl" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                <input type="password" placeholder="Password" className="w-full p-3 bg-gray-50 border rounded-2xl" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                <select className="w-full p-3 bg-gray-50 border rounded-2xl font-bold" onChange={(e) => setFormData({...formData, role: e.target.value})}>
                    <option value="recruiter">Recruiter</option>
                    <option value="admin">Admin</option>
                </select>
                <button className="w-full bg-slate-900 text-white py-3 rounded-2xl font-bold hover:bg-red-600 transition-all uppercase tracking-widest">Create Account</button>
            </form>
        </div>
    );
};

export default ManageUsers;