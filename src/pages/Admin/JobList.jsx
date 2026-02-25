import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Trash2, Edit3, XCircle, CheckCircle, Calendar, DollarSign, Users, X, Activity } from 'lucide-react';

const JobList = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingJob, setEditingJob] = useState(null);

    const fetchJobs = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/admin/jobs/all", {
                headers: { 'admin-secret-key': 'JM_IT_GLOBAL_SECURE_KEY_2026' }
            });
            setJobs(res.data.jobs);
            setLoading(false);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchJobs(); }, []);

    // 1. Delete Job Logic
    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: 'Are you sure?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            background: '#18181b', color: '#fff'
        });

        if (confirm.isConfirmed) {
            await axios.delete(`http://localhost:5000/api/admin/jobs/delete/${id}`, {
                headers: { 'admin-secret-key': 'JM_IT_GLOBAL_SECURE_KEY_2026' }
            });
            Swal.fire('Deleted!', 'Job removed successfully.', 'success');
            fetchJobs();
        }
    };

    // 2. Toggle Active/Close Logic
    const toggleStatus = async (job) => {
        const newStatus = job.status === 'active' ? 'close' : 'active';
        try {
            await axios.put(`http://localhost:5000/api/admin/jobs/update/${job.id}`, 
                { ...job, status: newStatus },
                { headers: { 'admin-secret-key': 'JM_IT_GLOBAL_SECURE_KEY_2026' } }
            );
            fetchJobs();
        } catch (err) { console.error(err); }
    };

    // 3. Update Job (Final Submit from Modal)
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/admin/jobs/update/${editingJob.id}`, 
                editingJob,
                { headers: { 'admin-secret-key': 'JM_IT_GLOBAL_SECURE_KEY_2026' } }
            );
            Swal.fire({ title: 'Updated!', icon: 'success', timer: 1500, showConfirmButton: false });
            setEditingJob(null);
            fetchJobs();
        } catch (err) { console.error(err); }
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-[#0a0a0a]">
            <div className="relative">
                <div className="h-24 w-24 rounded-full border-t-4 border-red-600 animate-spin"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-black text-xs uppercase tracking-widest">Loading</div>
            </div>
        </div>
    );

    return (
        <div className="p-4 md:p-10 min-h-screen bg-[#1d283f] text-zinc-300">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
                <div>
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">
                        Live <span className="text-red-600">Operations</span>
                    </h2>
                    <p className="text-zinc-500 font-medium mt-2">Manage your career broadcasts and track performance.</p>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-3xl flex items-center gap-4 backdrop-blur-md">
                    <div className="h-12 w-12 bg-red-600/10 rounded-2xl flex items-center justify-center text-red-600">
                        <Activity size={24} />
                    </div>
                    <div>
                        <p className="text-xs uppercase font-black text-zinc-500">Total Live Jobs</p>
                        <p className="text-2xl font-black text-white">{jobs.filter(j => j.status === 'active').length}</p>
                    </div>
                </div>
            </div>

            {/* Job Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {jobs.map((job) => (
                    <div key={job.id} 
                        className={`group relative bg-[#16181d] border border-zinc-800/50 p-7 rounded-[32px] transition-all duration-500 hover:border-red-600/30 hover:shadow-[0_20px_50px_rgba(239,68,68,0.05)] ${job.status === 'close' ? 'opacity-40 grayscale' : ''}`}>
                        
                        {/* Top Row: Status & Applicants */}
                        <div className="flex justify-between items-start mb-6">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${job.status === 'active' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                                {job.status}
                            </span>
                            <div className="flex items-center gap-2 bg-zinc-800/50 px-3 py-1.5 rounded-xl border border-zinc-700/50">
                                <Users size={14} className="text-red-500" />
                                <span className="text-sm font-bold text-white">{job.total_applicants || 0} Applied</span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-white group-hover:text-red-500 transition-colors line-clamp-1 italic">{job.job_title}</h3>
                            
                            <div className="flex flex-wrap gap-3">
                                <div className="flex items-center gap-2 bg-zinc-900 px-3 py-2 rounded-2xl text-xs font-bold border border-zinc-800">
                                    <DollarSign size={14} className="text-zinc-500"/> {job.salary_range} USD
                                </div>
                                <div className="flex items-center gap-2 bg-zinc-900 px-3 py-2 rounded-2xl text-xs font-bold border border-zinc-800">
                                    <Calendar size={14} className="text-zinc-500"/> {new Date(job.end_date).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="pt-6 flex gap-2">
                                <button onClick={() => toggleStatus(job)} title="Toggle Status"
                                    className="p-4 bg-zinc-900 hover:bg-white hover:text-black rounded-2xl transition-all duration-300 border border-zinc-800 flex-1 flex justify-center">
                                    {job.status === 'active' ? <XCircle size={20}/> : <CheckCircle size={20}/>}
                                </button>
                                
                                <button onClick={() => setEditingJob(job)} title="Edit Job"
                                    className="p-4 bg-zinc-900 hover:bg-blue-600 hover:text-white rounded-2xl transition-all duration-300 border border-zinc-800 flex-1 flex justify-center">
                                    <Edit3 size={20}/>
                                </button>

                                <button onClick={() => handleDelete(job.id)} title="Delete Job"
                                    className="p-4 bg-zinc-900 hover:bg-red-600 hover:text-white rounded-2xl transition-all duration-300 border border-zinc-800 flex-1 flex justify-center text-red-600">
                                    <Trash2 size={20}/>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- MODAL (Softened) --- */}
            {editingJob && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
                    <div className="bg-[#16181d] w-full max-w-md p-8 rounded-[40px] border border-zinc-800 relative shadow-2xl">
                        <button onClick={() => setEditingJob(null)} className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors">
                            <X size={28} />
                        </button>
                        <h4 className="text-2xl font-black text-white mb-6 italic uppercase tracking-tight">Modify Broadcast</h4>
                        {/* Form contents same as before but with dark-styled inputs */}
                        <form onSubmit={handleUpdateSubmit} className="space-y-4">
                            <input className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-2xl focus:border-red-600 outline-none text-white font-bold" value={editingJob.job_title} onChange={(e) => setEditingJob({...editingJob, job_title: e.target.value})} placeholder="Job Title" />
                            <input className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-2xl focus:border-red-600 outline-none text-white font-bold" value={editingJob.salary_range} onChange={(e) => setEditingJob({...editingJob, salary_range: e.target.value})} placeholder="Salary" />
                            <input type="date" className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-2xl focus:border-red-600 outline-none text-white font-bold appearance-none" value={editingJob.end_date.split('T')[0]} onChange={(e) => setEditingJob({...editingJob, end_date: e.target.value})} />
                            <button type="submit" className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black uppercase tracking-widest transition-all mt-4 shadow-[0_10px_30px_rgba(239,68,68,0.3)]">
                                Confirm Update
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobList;