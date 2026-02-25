import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { UserPlus, Trash2, ShieldAlert, ShieldCheck, Mail, X, User } from 'lucide-react';

const StaffManager = () => {
    const [members, setMembers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ full_name: '', email: '', password: '', role: 'admin' });

    const fetchMembers = async () => {
        try {
            // ✅ Ensure this API returns all roles (admin, hr_manager, moderator, recruiter)
            const res = await axios.get('http://localhost:5000/api/staff/all-members');
            setMembers(res.data);
        } catch (err) { 
            console.error("Fetch Error:", err); 
        }
    };

    useEffect(() => { fetchMembers(); }, []);

    // --- Role Color Helper ---
    const getRoleBadge = (role) => {
        const roles = {
            superadmin: 'bg-purple-600 text-white',
            admin: 'bg-blue-600 text-white',
            recruiter: 'bg-black text-white',
            admin: 'bg-emerald-600 text-white',
            hr_manager: 'bg-orange-600 text-white',
            moderator: 'bg-slate-600 text-white'
        };
        return roles[role] || 'bg-gray-400 text-white';
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Terminate Authority?',
            text: "This member will lose all access immediately!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#000',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Delete!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:5000/api/staff/delete/${id}`);
                    Swal.fire('Deleted!', 'Authority Revoked.', 'success');
                    fetchMembers();
                } catch (err) { Swal.fire('Error', 'Deletion failed', 'error'); }
            }
        });
    };

    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'approved' ? 'suspended' : 'approved';
        try {
            await axios.put(`http://localhost:5000/api/staff/update-status/${id}`, { status: newStatus });
            fetchMembers();
            Swal.fire({ title: 'Status Synced!', icon: 'success', timer: 800, showConfirmButton: false });
        } catch (err) { Swal.fire('Error', 'Update failed', 'error'); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // status default 'approved' pathacchi jate admin-ke abar approve korte na hoy
            await axios.post('http://localhost:5000/api/auth/register', { ...formData, status: 'approved', registeredBy: 'superadmin' });
            Swal.fire('Success', `${formData.role.toUpperCase()} Appointed!`, 'success');
            setShowForm(false);
            fetchMembers();
        } catch (err) { Swal.fire('Error', 'Registration Failed', 'error'); }
        setLoading(false);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-700 p-2">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 gap-4">
                <div>
                    <h2 className="text-3xl font-black italic uppercase text-slate-900 tracking-tighter">Team Control <span className="text-red-600">Center</span></h2>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[3px] mt-1 italic">Manage staff & recruiters with absolute authority</p>
                </div>
                <button 
                    onClick={() => setShowForm(!showForm)}
                    className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black italic uppercase text-xs transition-all shadow-xl ${showForm ? 'bg-black text-white' : 'bg-red-600 text-white hover:scale-105 hover:bg-black'}`}
                >
                    {showForm ? <X size={18}/> : <UserPlus size={18}/>} 
                    {showForm ? "Cancel Action" : "Recruit Staff"}
                </button>
            </div>

            {/* Add Member Form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[50px] shadow-2xl border-[6px] border-black grid grid-cols-1 md:grid-cols-4 gap-6 animate-in slide-in-from-top-10">
                    <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase ml-2">Full Name</label>
                        <input type="text" className="w-full p-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-red-600 font-bold italic" placeholder="NAME" onChange={(e)=>setFormData({...formData, full_name: e.target.value})} required />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase ml-2">Email</label>
                        <input type="email" className="w-full p-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-red-600 font-bold italic" placeholder="EMAIL" onChange={(e)=>setFormData({...formData, email: e.target.value})} required />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase ml-2">Secret Key</label>
                        <input type="password" className="w-full p-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-red-600 font-bold italic" placeholder="••••••••" onChange={(e)=>setFormData({...formData, password: e.target.value})} required />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase ml-2">Assigned Role</label>
                        <select className="w-full p-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-red-600 font-black italic uppercase" value={formData.role} onChange={(e)=>setFormData({...formData, role: e.target.value})}>
                            <option value="admin">admin</option>
                            <option value="hr_manager">HR Manager</option>
                            <option value="moderator">Moderator</option>
                            <option value="recruiter">Recruiter</option>
                        </select>
                    </div>
                    <button disabled={loading} className="md:col-span-4 bg-red-600 text-white p-5 rounded-[25px] font-black uppercase italic tracking-[5px] hover:bg-black transition-all shadow-lg">
                        {loading ? "PROCESING..." : "CONFIRM APPOINTMENT"}
                    </button>
                </form>
            )}

            {/* Members Table */}
            <div className="bg-white rounded-[50px] shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-900 text-white uppercase text-[11px] font-black italic tracking-widest">
                            <tr>
                                <th className="p-8">Official Member</th>
                                <th className="p-8">Authority</th>
                                <th className="p-8 text-center">Status Control</th>
                                <th className="p-8 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {members.length > 0 ? members.map((member) => (
                                <tr key={member.id} className="hover:bg-slate-50 transition-all group">
                                    <td className="p-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-red-600 text-white rounded-2xl flex items-center justify-center font-black italic text-xl shadow-lg group-hover:rotate-6 transition-transform uppercase">
                                                {member.full_name ? member.full_name[0] : <User size={20}/>}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 italic text-base uppercase tracking-tight">{member.full_name}</p>
                                                <p className="text-[11px] text-gray-400 font-bold flex items-center gap-1 lowercase"><Mail size={12}/> {member.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <span className={`${getRoleBadge(member.role)} px-4 py-2 rounded-xl text-[10px] font-black uppercase italic tracking-widest shadow-md inline-block min-w-[100px] text-center`}>
                                            {member.role.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="p-8">
                                        <div className="flex justify-center">
                                            <button 
                                                onClick={() => toggleStatus(member.id, member.status)}
                                                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black italic text-[10px] uppercase tracking-wider transition-all shadow-sm
                                                ${member.status === 'approved' ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white' : 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white'}`}
                                            >
                                                {member.status === 'approved' ? <ShieldCheck size={14}/> : <ShieldAlert size={14}/>}
                                                {member.status}
                                            </button>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <div className="flex justify-center">
                                            <button 
                                                onClick={() => handleDelete(member.id)}
                                                className="w-12 h-12 bg-gray-50 text-gray-300 hover:bg-red-600 hover:text-white rounded-2xl flex items-center justify-center transition-all shadow-sm hover:shadow-red-200"
                                            >
                                                <Trash2 size={20}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="p-20 text-center text-gray-400 font-black italic uppercase tracking-widest">No Authority Found In Records</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StaffManager;