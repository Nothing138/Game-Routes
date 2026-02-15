import React, { useState } from 'react';
import axios from 'axios';

const AddUser = () => {
    const [formData, setFormData] = useState({ full_name: '', email: '', password: '', role: 'admin' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/register', formData);
            alert("New User Added Successfully!");
        } catch (err) {
            alert("Error adding user!");
        }
    };

    return (
        <div className="bg-white p-6 rounded shadow-md max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Admin/Recruiter</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Full Name" className="w-full border p-2" onChange={(e) => setFormData({...formData, full_name: e.target.value})} required />
                <input type="email" placeholder="Email" className="w-full border p-2" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                <input type="password" placeholder="Password" className="w-full border p-2" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                <select className="w-full border p-2" onChange={(e) => setFormData({...formData, role: e.target.value})}>
                    <option value="admin">Admin</option>
                    <option value="recruiter">Recruiter</option>
                </select>
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Add User</button>
            </form>
        </div>
    );
};

export default AddUser;