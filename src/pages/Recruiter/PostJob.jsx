import React, { useState } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';

const PostJob = () => {
    const [formData, setFormData] = useState({
        title: '', location: '', job_type: 'on-site', 
        salary_range: '', category: '', description: '', 
        requirements: '', last_date: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            const res = await axios.post('http://localhost:5000/api/jobs/post', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                toast.success("Job Posted Successfully! 🚀");
            }
        } catch (err) {
            toast.error(err.response?.data?.msg || "Post fail koreche!");
        }
    };

    return (
        <div className="max-w-2xl bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-lg">
            <Toaster />
            <h2 className="text-2xl font-black mb-6 dark:text-white">Create New Vacancy</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Job Title" className="w-full p-4 rounded-xl border dark:bg-slate-800 dark:text-white" onChange={(e) => setFormData({...formData, title: e.target.value})} required />
                <input type="text" placeholder="Location" className="w-full p-4 rounded-xl border dark:bg-slate-800 dark:text-white" onChange={(e) => setFormData({...formData, location: e.target.value})} required />
                <select className="w-full p-4 rounded-xl border dark:bg-slate-800 dark:text-white" onChange={(e) => setFormData({...formData, job_type: e.target.value})}>
                    <option value="on-site">On-site</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                </select>
                <input type="date" className="w-full p-4 rounded-xl border dark:bg-slate-800 dark:text-white" onChange={(e) => setFormData({...formData, last_date: e.target.value})} required />
                <textarea placeholder="Job Description" className="w-full p-4 rounded-xl border dark:bg-slate-800 dark:text-white" rows="4" onChange={(e) => setFormData({...formData, description: e.target.value})} required></textarea>
                <button type="submit" className="w-full bg-indigo-600 text-white p-4 rounded-xl font-bold hover:bg-indigo-700">Publish Job</button>
            </form>
        </div>
    );
};

export default PostJob;