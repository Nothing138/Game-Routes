import React, { useState } from 'react';
import axios from 'axios';
import { Send, PlusCircle, Loader2, Calendar } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2'; // SweetAlert Import

const PostJob = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '', 
        location: '', 
        job_type: 'Full-time', 
        salary_range: '', 
        category: '', 
        description: '', 
        requirements: '',
        last_date: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        // SweetAlert Confirmation
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to publish this vacancy?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#4F46E5', // Indigo-600
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, Publish it!',
            background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#fff',
            color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
        });

        if (result.isConfirmed) {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    toast.error("Vaiya, please login first!");
                    setLoading(false);
                    return;
                }

                const res = await axios.post('http://localhost:5000/api/jobs/post', formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Published!',
                        text: 'Your job circular is now live.',
                        timer: 2000,
                        showConfirmButton: false
                    });

                    // Reset Form
                    setFormData({ 
                        title: '', location: '', job_type: 'Full-time', 
                        salary_range: '', category: '', description: '', 
                        requirements: '', last_date: '' 
                    });
                }
            } catch (err) {
                console.error("API Error:", err);
                toast.error(err.response?.data?.msg || "Post korte somossa hoyeche!");
            } finally {
                setLoading(false); // Eikhane loading bondho hobe
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 p-10 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-indigo-100/20">
            <Toaster position="top-center" />
            
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h2 className="text-3xl font-black italic uppercase text-slate-900 dark:text-white tracking-tighter flex items-center gap-3">
                        <PlusCircle className="text-indigo-600" size={32} /> Create New Circular
                    </h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2 italic pl-1">Target the elite talent pool</p>
                </div>
            </div>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Job Title */}
                <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase text-slate-500 tracking-widest ml-1">Job Title</label>
                    <input 
                        type="text" 
                        value={formData.title}
                        placeholder="e.g. Senior React Developer" 
                        className="w-full p-4 rounded-2xl border border-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none focus:ring-4 ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium" 
                        onChange={(e) => setFormData({...formData, title: e.target.value})} 
                        required 
                    />
                </div>

                {/* Category */}
                <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase text-slate-500 tracking-widest ml-1">Category</label>
                    <input 
                        type="text" 
                        value={formData.category}
                        placeholder="e.g. Engineering / Design" 
                        className="w-full p-4 rounded-2xl border border-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none focus:ring-4 ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium" 
                        onChange={(e) => setFormData({...formData, category: e.target.value})} 
                        required 
                    />
                </div>

                {/* Location */}
                <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase text-slate-500 tracking-widest ml-1">Location</label>
                    <input 
                        type="text" 
                        value={formData.location}
                        placeholder="e.g. Remote or Dhaka, BD" 
                        className="w-full p-4 rounded-2xl border border-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none focus:ring-4 ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium" 
                        onChange={(e) => setFormData({...formData, location: e.target.value})} 
                        required
                    />
                </div>

                {/* Job Type */}
                <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase text-slate-500 tracking-widest ml-1">Job Type</label>
                    <select 
                        value={formData.job_type}
                        className="w-full p-4 rounded-2xl border border-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none focus:ring-4 ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold" 
                        onChange={(e) => setFormData({...formData, job_type: e.target.value})}
                    >
                        <option value="on-site">On-site</option>
                        <option value="remote">Remote</option>
                        <option value="hybrid">Hybrid</option>
                    </select>
                </div>

                {/* Salary Range */}
                <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase text-slate-500 tracking-widest ml-1">Salary Range</label>
                    <input 
                        type="text" 
                        value={formData.salary_range}
                        placeholder="e.g. $1200 - $2000" 
                        className="w-full p-4 rounded-2xl border border-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none focus:ring-4 ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium" 
                        onChange={(e) => setFormData({...formData, salary_range: e.target.value})} 
                    />
                </div>

                {/* Last Date to Apply */}
                <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase text-slate-500 tracking-widest ml-1 flex items-center gap-2">
                        <Calendar size={14} className="text-indigo-500" /> Last Date to Apply
                    </label>
                    <input 
                        type="date" 
                        value={formData.last_date}
                        className="w-full p-4 rounded-2xl border border-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none focus:ring-4 ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium" 
                        onChange={(e) => setFormData({...formData, last_date: e.target.value})} 
                        required 
                    />
                </div>

                {/* Job Description */}
                <div className="md:col-span-2 space-y-3">
                    <label className="text-[11px] font-black uppercase text-slate-500 tracking-widest ml-1">Detailed Description</label>
                    <textarea 
                        rows="4" 
                        value={formData.description}
                        placeholder="What is this role about?"
                        className="w-full p-5 rounded-[25px] border border-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none focus:ring-4 ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium" 
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        required
                    ></textarea>
                </div>

                {/* Requirements */}
                <div className="md:col-span-2 space-y-3">
                    <label className="text-[11px] font-black uppercase text-slate-500 tracking-widest ml-1">Key Requirements</label>
                    <textarea 
                        rows="3" 
                        value={formData.requirements}
                        placeholder="Skills, Experience, etc."
                        className="w-full p-5 rounded-[25px] border border-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none focus:ring-4 ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium" 
                        onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                        required
                    ></textarea>
                </div>

                {/* Submit Button */}
                <button 
                    type="submit" 
                    disabled={loading}
                    className="md:col-span-2 bg-slate-900 dark:bg-indigo-600 text-white p-5 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-indigo-600 dark:hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-70"
                >
                    {loading ? (
                        <Loader2 className="animate-spin" size={20} />
                    ) : (
                        <>
                            <Send size={18} strokeWidth={3} /> Publish Vacancy
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default PostJob;