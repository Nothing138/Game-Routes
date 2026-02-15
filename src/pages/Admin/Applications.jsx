import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, CheckCircle, XCircle, Eye } from 'lucide-react';

const Applications = () => {
    const [apps, setApps] = useState([]);

    useEffect(() => {
        const fetchApps = async () => {
            const res = await axios.get('http://localhost:5000/api/admin/visa-applications');
            setApps(res.data);
        };
        fetchApps();
    }, []);

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-black italic uppercase tracking-tighter">Visa <span className="text-red-600">Process Control</span></h2>
            
            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-[10px] font-black uppercase text-gray-400 tracking-widest italic">
                        <tr>
                            <th className="p-6">Client Info</th>
                            <th className="p-6">Visa Type</th>
                            <th className="p-6">Destination</th>
                            <th className="p-6">Status</th>
                            <th className="p-6">Payment</th>
                            <th className="p-6 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {apps.map((app) => (
                            <tr key={app.id} className="hover:bg-slate-50 transition-all">
                                <td className="p-6">
                                    <p className="font-black text-gray-900 italic uppercase leading-none">{app.full_name}</p>
                                    <p className="text-[9px] font-bold text-gray-400 mt-1">ID: #VISA-{app.id}</p>
                                </td>
                                <td className="p-6"><span className="bg-slate-100 px-3 py-1 rounded-lg text-[10px] font-black uppercase text-slate-500 italic">{app.visa_type}</span></td>
                                <td className="p-6 font-bold text-slate-700">{app.destination_country}</td>
                                <td className="p-6">
                                    <span className={`flex items-center gap-1 text-[10px] font-black uppercase italic ${app.application_status === 'approved' ? 'text-green-500' : 'text-orange-500'}`}>
                                        {app.application_status === 'approved' ? <CheckCircle size={12}/> : <Clock size={12}/>}
                                        {app.application_status}
                                    </span>
                                </td>
                                <td className="p-6 font-bold text-xs uppercase">{app.payment_status}</td>
                                <td className="p-6 text-right">
                                    <button className="bg-gray-100 p-2 rounded-xl text-gray-600 hover:bg-red-600 hover:text-white transition-all"><Eye size={16}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Applications;