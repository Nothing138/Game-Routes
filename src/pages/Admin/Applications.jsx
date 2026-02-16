import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Clock, CheckCircle, XCircle, Eye, Trash2, Search, Filter, ShieldCheck, ShieldAlert, CreditCard } from 'lucide-react';

const Applications = () => {
    const [apps, setApps] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showAmount, setShowAmount] = useState({}); // To toggle payment visibility

    const fetchData = async () => {
        const res = await axios.get('http://localhost:5000/api/admin/visa-applications');
        setApps(res.data);
    };

    useEffect(() => { fetchData(); }, []);

    // --- Actions ---
    const handleUpdate = async (app) => {
        const { value: formValues } = await Swal.fire({
            title: `<span class="italic uppercase font-black">Manage Application</span>`,
            html: `
                <div class="text-left p-2">
                    <label class="text-[10px] font-bold uppercase text-gray-400">Process Status</label>
                    <select id="swal-status" class="w-full p-3 mb-4 bg-gray-50 border-none rounded-2xl font-bold">
                        <option value="submitted" ${app.application_status === 'submitted' ? 'selected' : ''}>Submitted</option>
                        <option value="reviewing" ${app.application_status === 'reviewing' ? 'selected' : ''}>Reviewing</option>
                        <option value="approved" ${app.application_status === 'approved' ? 'selected' : ''}>Approved</option>
                        <option value="rejected" ${app.application_status === 'rejected' ? 'selected' : ''}>Rejected</option>
                    </select>
                    
                    <label class="text-[10px] font-bold uppercase text-gray-400">Payment Control</label>
                    <select id="swal-payment" class="w-full p-3 bg-gray-50 border-none rounded-2xl font-bold" ${app.payment_status === 'paid' ? 'disabled' : ''}>
                        <option value="unpaid" ${app.payment_status === 'unpaid' ? 'selected' : ''}>Unpaid</option>
                        <option value="paid" ${app.payment_status === 'paid' ? 'selected' : ''}>Paid</option>
                    </select>
                    ${app.payment_status === 'paid' ? '<p class="text-[9px] text-green-500 mt-1 font-bold italic">Note: Paid status cannot be reverted</p>' : ''}
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Update Records',
            confirmButtonColor: '#000',
            customClass: { popup: 'rounded-[40px]' },
            preConfirm: () => {
                return {
                    application_status: document.getElementById('swal-status').value,
                    payment_status: document.getElementById('swal-payment').value
                }
            }
        });

        if (formValues) {
            try {
                await axios.put(`http://localhost:5000/api/admin/visa-applications/${app.id}`, formValues);
                Swal.fire('Updated!', 'Database Synced.', 'success');
                fetchData();
            } catch (err) { Swal.fire('Error', 'Update failed', 'error'); }
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Wipe Data?',
            text: "This application will be permanently deleted.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            confirmButtonText: 'Yes, Delete!',
            customClass: { popup: 'rounded-[30px]' }
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.delete(`http://localhost:5000/api/admin/visa-applications/${id}`);
                fetchData();
                Swal.fire('Deleted!', '', 'success');
            }
        });
    };

    // --- Filtering Logic ---
    const filteredApps = apps.filter(app => {
        const matchesSearch = app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              app.destination_country.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || app.application_status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-3xl font-black italic uppercase tracking-tighter">Visa <span className="text-red-600 underline">Control</span></h2>
                
                {/* Search & Filter Bar */}
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 text-gray-400" size={16}/>
                        <input 
                            placeholder="Search applicant..." 
                            className="pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-2xl text-xs font-bold w-full shadow-sm outline-none focus:ring-2 focus:ring-red-500"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select 
                        className="p-2 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase italic shadow-sm"
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="submitted">Submitted</option>
                        <option value="reviewing">Reviewing</option>
                        <option value="approved">Approved</option>
                    </select>
                </div>
            </div>

            {/* Application Table */}
            <div className="bg-white rounded-[40px] shadow-2xl border border-gray-50 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-900 text-white text-[9px] font-black uppercase tracking-[3px] italic">
                        <tr>
                            <th className="p-6">Applicant</th>
                            <th className="p-6">Visa Class</th>
                            <th className="p-6">Destination</th>
                            <th className="p-6">Amount</th>
                            <th className="p-6">Status</th>
                            <th className="p-6">Payment</th>
                            <th className="p-6 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredApps.map((app) => (
                            <tr key={app.id} className="hover:bg-red-50/30 transition-all group">
                                <td className="p-6">
                                    <p className="font-black text-gray-900 italic uppercase leading-none text-sm group-hover:text-red-600">{app.full_name}</p>
                                    <p className="text-[9px] font-bold text-gray-400 mt-1">UUID: {app.id*123456}</p>
                                </td>
                                <td className="p-6">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{app.visa_type_name || 'General'}</span>
                                        <span className="text-[9px] font-bold text-red-500 italic uppercase">{app.visa_type}</span>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-red-600"></div>
                                        <span className="font-black text-gray-700 italic uppercase text-xs">{app.destination_country}</span>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => setShowAmount({...showAmount, [app.id]: !showAmount[app.id]})}
                                            className="text-gray-300 hover:text-black transition-colors"
                                        >
                                            {showAmount[app.id] ? <ShieldCheck size={14}/> : <ShieldAlert size={14}/>}
                                        </button>
                                        <span className={`font-black italic text-sm ${showAmount[app.id] ? 'blur-0' : 'blur-[4px] shadow-sm'} transition-all duration-300`}>
                                            ${app.application_charge || '0.00'}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase italic tracking-widest flex items-center gap-1 w-fit
                                        ${app.application_status === 'approved' ? 'bg-green-100 text-green-600' : 
                                          app.application_status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                                        {app.application_status}
                                    </span>
                                </td>
                                <td className="p-6">
                                    <div className={`flex items-center gap-1 text-[10px] font-black uppercase italic ${app.payment_status === 'paid' ? 'text-blue-600' : 'text-gray-400'}`}>
                                        <CreditCard size={12}/>
                                        {app.payment_status}
                                    </div>
                                </td>
                                <td className="p-6 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                        <button onClick={() => handleUpdate(app)} className="bg-black text-white p-2 rounded-xl hover:bg-red-600 transition-all shadow-lg"><Eye size={16}/></button>
                                        <button onClick={() => handleDelete(app.id)} className="bg-red-50 text-red-600 p-2 rounded-xl hover:bg-red-600 hover:text-white transition-all"><Trash2 size={16}/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredApps.length === 0 && (
                    <div className="p-20 text-center flex flex-col items-center">
                        <XCircle size={48} className="text-gray-100 mb-4"/>
                        <p className="font-black italic uppercase text-gray-300 tracking-widest">No Records Found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Applications;