import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { UserPlus, ShieldAlert, ShieldCheck, Trash2, Briefcase, Users, Ban, CheckCircle, Search, ExternalLink } from 'lucide-react';

const RecruiterManager = () => {
    const [recruiters, setRecruiters] = useState([]);
    const [activeTab, setActiveTab] = useState('requests'); // 'requests' or 'list'
    const [searchTerm, setSearchTerm] = useState('');

    const fetchRecruiters = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/recruiters/manage');
            setRecruiters(res.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchRecruiters(); }, []);

    const updateStatus = async (id, status) => {
        const actionText = status === 'approved' ? 'Approve' : status === 'suspended' ? 'Suspend' : 'Activate';
        Swal.fire({
            title: `Are you sure?`,
            text: `You want to ${actionText} this recruiter.`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#000',
            confirmButtonText: `Yes, ${actionText}`
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.patch(`http://localhost:5000/api/admin/recruiters/${id}/status`, { status });
                Swal.fire('Updated!', `Recruiter is now ${status}.`, 'success');
                fetchRecruiters();
            }
        });
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Delete Recruiter?',
            text: "This will wipe all their data and jobs!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            confirmButtonText: 'Delete Permanently'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.delete(`http://localhost:5000/api/admin/recruiters/${id}`);
                fetchRecruiters();
            }
        });
    };

    const pendingRequests = recruiters.filter(r => r.status === 'pending');
    const approvedRecruiters = recruiters.filter(r => (r.status === 'approved' || r.status === 'suspended') && r.company_name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-8">
            {/* Header & Tabs */}
            <div className="flex flex-col lg:flex-row justify-between items-end gap-6">
                <div>
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter">Recruiter <span className="text-red-600">HQ</span></h2>
                    <div className="flex gap-4 mt-6">
                        <button 
                            onClick={() => setActiveTab('requests')}
                            className={`px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'requests' ? 'bg-black text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                        >
                            Requests ({pendingRequests.length})
                        </button>
                        <button 
                            onClick={() => setActiveTab('list')}
                            className={`px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'list' ? 'bg-black text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                        >
                            Active Recruiters ({approvedRecruiters.length})
                        </button>
                    </div>
                </div>

                {activeTab === 'list' && (
                    <div className="relative w-full lg:w-72">
                        <Search className="absolute left-4 top-3 text-gray-400" size={16}/>
                        <input 
                            placeholder="Search Agency..." 
                            className="w-full pl-12 pr-4 py-2.5 bg-white border-2 border-black rounded-xl font-bold text-xs outline-none"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 gap-6">
                {(activeTab === 'requests' ? pendingRequests : approvedRecruiters).map(rec => (
                    <div key={rec.id} className="relative group">
                        <div className="absolute inset-0 bg-black rounded-[40px] translate-x-1 translate-y-1"></div>
                        <div className="relative bg-white border-2 border-black rounded-[40px] p-8 flex flex-col lg:flex-row gap-8 items-center">
                            
                            {/* Profile Section */}
                            <div className="flex items-center gap-5 lg:w-1/4">
                                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center border-2 border-black shrink-0 overflow-hidden">
                                    {rec.logo_url ? <img src={rec.logo_url} alt="" className="w-full h-full object-cover"/> : <Users className="text-red-600"/>}
                                </div>
                                <div>
                                    <h4 className="font-black uppercase italic leading-none text-lg">{rec.company_name}</h4>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase mt-1 tracking-tighter">{rec.email}</p>
                                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded mt-2 inline-block ${rec.status === 'suspended' ? 'bg-red-600 text-white' : 'bg-green-100 text-green-600'}`}>
                                        {rec.status}
                                    </span>
                                </div>
                            </div>

                            {/* Stats Section (Bomb Feature) */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-grow text-center lg:border-l lg:border-r border-gray-100 lg:px-8">
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Jobs Posted</p>
                                    <p className="text-xl font-black italic flex items-center justify-center gap-1"><Briefcase size={14} className="text-blue-500"/> {rec.total_jobs}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Selected</p>
                                    <p className="text-xl font-black italic flex items-center justify-center gap-1 text-green-600"><CheckCircle size={14}/> {rec.hired_count}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Rejected</p>
                                    <p className="text-xl font-black italic flex items-center justify-center gap-1 text-red-500"><Ban size={14}/> {rec.rejected_count}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">In Review</p>
                                    <p className="text-xl font-black italic text-orange-400">{rec.pending_count}</p>
                                </div>
                            </div>

                            {/* Actions Section */}
                            <div className="flex flex-wrap gap-3 lg:w-1/5 justify-end">
                                {rec.status === 'pending' ? (
                                    <>
                                        <button onClick={() => updateStatus(rec.id, 'approved')} className="flex-1 bg-green-500 text-white p-3 rounded-2xl font-black text-[10px] uppercase hover:bg-black transition-all flex items-center justify-center gap-2">
                                            <ShieldCheck size={16}/> Approve
                                        </button>
                                        <button onClick={() => handleDelete(rec.id)} className="p-3 bg-red-50 text-red-500 rounded-2xl border-2 border-red-100 hover:bg-red-500 hover:text-white transition-all">
                                            <Trash2 size={16}/>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        {rec.status === 'suspended' ? (
                                            <button onClick={() => updateStatus(rec.id, 'approved')} className="flex-1 bg-black text-white p-3 rounded-2xl font-black text-[10px] uppercase flex items-center justify-center gap-2">
                                                <ShieldCheck size={16}/> Unsuspend
                                            </button>
                                        ) : (
                                            <button onClick={() => updateStatus(rec.id, 'suspended')} className="flex-1 bg-red-50 text-red-600 border-2 border-red-200 p-3 rounded-2xl font-black text-[10px] uppercase hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2">
                                                <Ban size={16}/> Suspend
                                            </button>
                                        )}
                                        <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-black hover:text-white transition-all">
                                            <ExternalLink size={16}/>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {((activeTab === 'requests' ? pendingRequests : approvedRecruiters).length === 0) && (
                    <div className="p-20 text-center bg-white rounded-[50px] border-4 border-dashed border-gray-100">
                        <p className="font-black italic uppercase text-gray-300 tracking-[10px]">Zero Data Found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecruiterManager;