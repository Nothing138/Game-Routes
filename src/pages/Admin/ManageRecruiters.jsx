import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UserCheck, Clock } from 'lucide-react';
import Swal from 'sweetalert2'; // ✅ SweetAlert Import

const ManageRecruiters = () => {
    const [recruiters, setRecruiters] = useState([]);

    useEffect(() => {
        fetchPending();
    }, []);

    const fetchPending = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/pending-recruiters');
            setRecruiters(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleApprove = async (id) => {
        // ✅ Confirmation SweetAlert
        Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to approve this recruiter?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e11d48', // Tailwind red-600
            cancelButtonColor: '#0f172a',  // Tailwind slate-900
            confirmButtonText: 'Yes, Approve!',
            background: '#ffffff',
            borderRadius: '20px'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axios.put(`http://localhost:5000/api/admin/approve-recruiter/${id}`);
                    
                    if (res.data.success) {
                        // ✅ Success SweetAlert
                        Swal.fire({
                            title: 'Approved!',
                            text: 'Recruiter has been given platform access.',
                            icon: 'success',
                            confirmButtonColor: '#e11d48',
                            timer: 2000
                        });
                        fetchPending(); // List refresh
                    }
                } catch (error) {
                    Swal.fire('Error!', 'Something went wrong.', 'error');
                }
            }
        });
    };

    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            <h2 className="text-3xl font-black italic uppercase text-slate-900 mb-8 border-l-8 border-red-600 pl-4">
                Recruiter <span className="text-red-600">Requests</span>
            </h2>

            <div className="grid gap-6">
                {recruiters.length === 0 ? (
                    <div className="bg-white p-10 rounded-[30px] shadow-sm border border-gray-100 text-center">
                         <p className="text-slate-400 italic">No pending requests found at the moment.</p>
                    </div>
                ) : recruiters.map(r => (
                    <div key={r.id} className="bg-white p-6 rounded-[30px] shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center">
                                <UserCheck className="text-slate-400" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-lg">{r.full_name}</h4>
                                <p className="text-sm text-slate-500">{r.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                                <Clock size={12}/> Pending Approval
                            </span>
                            <button 
                                onClick={() => handleApprove(r.id)}
                                className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold text-xs uppercase hover:bg-red-600 transition-all shadow-lg hover:shadow-red-200 active:scale-95"
                            >
                                Approve Access
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageRecruiters;