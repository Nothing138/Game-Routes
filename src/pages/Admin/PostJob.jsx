import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Briefcase, MapPin, DollarSign, FileText, Rocket } from 'lucide-react';

const PostJob = () => {
    const [jobData, setJobData] = useState({
        title: '', company_name: '', location: '', salary: '', job_type: 'Full-time', description: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/admin/jobs', jobData);
            Swal.fire({
                title: 'BOMB! Job Live',
                icon: 'success',
                confirmButtonColor: '#000',
                customClass: { popup: 'rounded-[30px]' }
            });
            setJobData({ title: '', company_name: '', location: '', salary: '', job_type: 'Full-time', description: '' });
        } catch (err) { Swal.fire('Error', 'Failed to post job', 'error'); }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-4xl font-black italic uppercase tracking-tighter">Launch <span className="text-red-600">Career Opportunity</span></h2>
            
            <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[50px] shadow-2xl border-4 border-black space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 ml-4 flex items-center gap-2"><Briefcase size={12}/> Job Title</label>
                        <input className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-red-500" placeholder="Software Engineer..." value={jobData.title} onChange={(e) => setJobData({...jobData, title: e.target.value})} required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 ml-4 flex items-center gap-2"><MapPin size={12}/> Location</label>
                        <input className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none" placeholder="Remote / Dhaka..." value={jobData.location} onChange={(e) => setJobData({...jobData, location: e.target.value})} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 ml-4 flex items-center gap-2"><DollarSign size={12}/> Salary Range</label>
                        <input className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none" placeholder="$50k - $80k..." value={jobData.salary} onChange={(e) => setJobData({...jobData, salary: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 ml-4 flex items-center gap-2">Job Type</label>
                        <select className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none appearance-none" value={jobData.job_type} onChange={(e) => setJobData({...jobData, job_type: e.target.value})}>
                            <option>Full-time</option>
                            <option>Part-time</option>
                            <option>Contract</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-4 flex items-center gap-2"><FileText size={12}/> Job Description</label>
                    <textarea rows="6" className="w-full p-6 bg-slate-50 rounded-[35px] font-bold outline-none focus:ring-2 focus:ring-red-500" placeholder="Responsibilities & Requirements..." value={jobData.description} onChange={(e) => setJobData({...jobData, description: e.target.value})} required></textarea>
                </div>

                <button type="submit" className="w-full bg-black text-white p-6 rounded-3xl font-black uppercase italic tracking-widest flex items-center justify-center gap-3 hover:bg-red-600 transition-all shadow-xl">
                    <Rocket size={20}/> Broadcast Circular
                </button>
            </form>
        </div>
    );
};

export default PostJob;