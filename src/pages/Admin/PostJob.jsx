import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Briefcase, MapPin, DollarSign, FileText, Rocket, Building, Layers, Send,Calendar } from 'lucide-react';

const PostJob = () => {
    const [jobData, setJobData] = useState({
        job_title: '', 
        company_name: '', 
        country: '', 
        salary_range: '', 
        job_type: 'on-site', 
        job_description: '',
        category: 'General',
        end_date: ''
    });

    const today = new Date().toISOString().split('T')[0];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = "http://localhost:5000/api/admin/jobs/post"; 
            const response = await axios.post(url, jobData, {
                headers: { 'admin-secret-key': 'JM_IT_GLOBAL_SECURE_KEY_2024' }
            });

            if (response.data.success) {
                Swal.fire({
                    title: '🚀 BOMB! Job Live',
                    text: 'Circular broadcasted across the globe!',
                    icon: 'success',
                    background: '#000',
                    color: '#fff',
                    confirmButtonColor: '#ef4444',
                    customClass: { popup: 'rounded-[30px] border-4 border-red-600' }
                });

                setJobData({ 
                    job_title: '', company_name: '', country: '', 
                    salary_range: '', job_type: 'on-site', 
                    job_description: '', category: 'General', end_date: ''
                });
            }
        } catch (err) { 
            console.error("Post Error:", err);
            Swal.fire('Error', 'Check server connection!', 'error'); 
        }
    };

    // Helper for input styling to keep code clean
    const inputStyle = "w-full p-4 bg-slate-100 dark:bg-zinc-800 dark:text-white rounded-2xl font-bold outline-none border-2 border-transparent focus:border-red-500 transition-all duration-300 shadow-inner";

    return (
        <div className="min-h-screen transition-colors duration-500 p-4 md:p-10">
            <div className="max-w-4xl mx-auto space-y-10">
                <div className="space-y-2 text-center md:text-left">

                </div>
                
                <form onSubmit={handleSubmit} className="bg-white/70 dark:bg-zinc-900/80 backdrop-blur-xl p-8 md:p-12 rounded-[40px] shadow-2xl space-y-8 relative overflow-hidden border-t-4 border-white/50">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                        <div className="space-y-3">
                            <label className="text-[11px] font-black uppercase text-zinc-400 ml-4 flex items-center gap-2"><Briefcase size={14}/> Job Title</label>
                            <input className={inputStyle} placeholder="Software Engineer" value={jobData.job_title} onChange={(e) => setJobData({...jobData, job_title: e.target.value})} required />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[11px] font-black uppercase text-zinc-400 ml-4 flex items-center gap-2"><Building size={14}/> Company Name</label>
                            <input className={inputStyle} placeholder="JM IT Limited" value={jobData.company_name} onChange={(e) => setJobData({...jobData, company_name: e.target.value})} required />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                        <div className="space-y-3">
                            <label className="text-[11px] font-black uppercase text-zinc-400 ml-4 flex items-center gap-2"><MapPin size={14}/> Country</label>
                            <input className={inputStyle} placeholder="USA / Remote" value={jobData.country} onChange={(e) => setJobData({...jobData, country: e.target.value})} required />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[11px] font-black uppercase text-zinc-400 ml-4 flex items-center gap-2"><DollarSign size={14}/> Salary (Digits only)</label>
                            <input 
                                type="text" 
                                className={inputStyle} 
                                placeholder="80000" 
                                value={jobData.salary_range} 
                                // Validation: Shudhu numbers allow korbe
                                onChange={(e) => setJobData({...jobData, salary_range: e.target.value.replace(/\D/g, '')})} 
                                required 
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[11px] font-black uppercase text-red-500 ml-4 flex items-center gap-2 font-bold"><Calendar size={14}/> Expiry Date</label>
                            <input 
                                type="date" 
                                className={inputStyle + " border-red-500/20"} 
                                min={today} // Restriction: Agert din select kora jabe na
                                value={jobData.end_date} 
                                onChange={(e) => setJobData({...jobData, end_date: e.target.value})} 
                                required 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                        <div className="space-y-3">
                            <label className="text-[11px] font-black uppercase text-zinc-400 ml-4">Job Type</label>
                            <select className={inputStyle} value={jobData.job_type} onChange={(e) => setJobData({...jobData, job_type: e.target.value})}>
                                <option value="on-site">On-site</option>
                                <option value="remote">Remote</option>
                                <option value="hybrid">Hybrid</option>
                            </select>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[11px] font-black uppercase text-zinc-400 ml-4">Category</label>
                            <input className={inputStyle} placeholder="IT / Engineering" value={jobData.category} onChange={(e) => setJobData({...jobData, category: e.target.value})} />
                        </div>
                    </div>

                    <div className="space-y-3 relative z-10">
                        <label className="text-[11px] font-black uppercase text-zinc-400 ml-4 flex items-center gap-2"><FileText size={14}/> Description</label>
                        <textarea rows="4" className={inputStyle + " rounded-[30px] resize-none"} placeholder="Job details..." value={jobData.job_description} onChange={(e) => setJobData({...jobData, job_description: e.target.value})} required></textarea>
                    </div>

                    <button type="submit" className="group w-full relative h-20 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-3xl font-black uppercase italic tracking-[0.2em] flex items-center justify-center gap-4 hover:scale-[1.02] transition-all duration-300 shadow-2xl">
                        <span className="relative z-10 flex items-center gap-3">Broadcast Circular <Send size={20} /></span>
                        <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PostJob;