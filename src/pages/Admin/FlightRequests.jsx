import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Plane, Calendar, User, CreditCard, CheckCircle, XCircle, Clock, MapPin } from 'lucide-react';

const FlightRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/flight-requests');
            setRequests(res.data);
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    const handleAction = async (id, action) => {
        if (action === 'accept') {
            const { value: cost } = await Swal.fire({
                title: 'Confirm Acceptance',
                input: 'number',
                inputLabel: 'Enter Total Ticket Cost (USD/BDT)',
                inputPlaceholder: 'e.g. 55000',
                showCancelButton: true,
                confirmButtonText: 'Accept & Save Cost',
                inputValidator: (value) => {
                    if (!value || value <= 0) return 'You must provide a valid cost!';
                }
            });

            if (cost) {
                updateStatus(id, 'accept', cost);
            }
        } else {
            Swal.fire({
                title: `Are you sure to ${action}?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, proceed'
            }).then((result) => {
                if (result.isConfirmed) updateStatus(id, action, 0);
            });
        }
    };

    const updateStatus = async (id, status, cost) => {
        try {
            await axios.patch(`http://localhost:5000/api/admin/flight-requests/${id}/status`, { status, total_cost: cost });
            Swal.fire('Success', `Flight request ${status}ed`, 'success');
            fetchData();
        } catch (err) {
            Swal.fire('Error', err.response?.data?.message || 'Action failed', 'error');
        }
    };

    const getStatusStyle = (status) => {
        switch(status) {
            case 'accept': return 'bg-green-100 text-green-700 border-green-200';
            case 'reject': return 'bg-red-100 text-red-700 border-red-200';
            case 'hold': return 'bg-amber-100 text-amber-700 border-amber-200';
            default: return 'bg-blue-100 text-blue-700 border-blue-200';
        }
    };

    if (loading) return <div className="p-10 text-center font-black">FETCHING FLIGHT DATA...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black uppercase italic tracking-tighter">FLIGHT <span className="text-red-600">REQUESTS</span></h2>
                <span className="bg-black text-white px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                    Total: {requests.length}
                </span>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {requests.map((req) => (
                    <div key={req.id} className="relative group">
                        <div className="absolute inset-0 bg-black rounded-[2rem] translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 transition-all"></div>
                        <div className="relative bg-white border-2 border-black rounded-[2rem] p-6 overflow-hidden">
                            
                            {/* Header Section */}
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 border-2 border-red-100">
                                        <Plane size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-sm uppercase italic">{req.full_name}</h3>
                                        <p className="text-[10px] text-gray-400 font-bold">{req.passport_number} • {req.contact_number}</p>
                                    </div>
                                </div>
                                <span className={`px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border-2 ${getStatusStyle(req.status)}`}>
                                    {req.status}
                                </span>
                            </div>

                            {/* Journey Details */}
                            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6">
                                <div>
                                    <span className="text-[8px] font-bold text-gray-400 uppercase">From</span>
                                    <p className="font-black text-xs flex items-center gap-1 uppercase tracking-tighter"><MapPin size={10} className="text-red-500"/> {req.departure_city}</p>
                                </div>
                                <div>
                                    <span className="text-[8px] font-bold text-gray-400 uppercase">To</span>
                                    <p className="font-black text-xs flex items-center gap-1 uppercase tracking-tighter"><MapPin size={10} className="text-blue-500"/> {req.destination_city}</p>
                                </div>
                                <div>
                                    <span className="text-[8px] font-bold text-gray-400 uppercase">Travel Date</span>
                                    <p className="font-bold text-xs flex items-center gap-1 tracking-tighter"><Calendar size={12}/> {new Date(req.travel_date).toDateString()}</p>
                                </div>
                                <div>
                                    <span className="text-[8px] font-bold text-gray-400 uppercase">Passenger</span>
                                    <p className="font-bold text-xs flex items-center gap-1 uppercase tracking-tighter"><User size={12}/> {req.passenger_count} Persons</p>
                                </div>
                            </div>

                            {/* Cost Section */}
                            <div className="flex items-center justify-between border-t-2 border-dashed border-gray-100 pt-4">
                                <div>
                                    <span className="text-[8px] font-black text-gray-400 uppercase">Quoted Cost</span>
                                    <h4 className="text-xl font-black italic text-red-600 tracking-tighter">
                                        {req.total_cost > 0 ? `$${req.total_cost}` : "NOT SET"}
                                    </h4>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleAction(req.id, 'hold')} className="p-2 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-600 hover:text-white transition-all border border-amber-100"><Clock size={18}/></button>
                                    <button onClick={() => handleAction(req.id, 'reject')} className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all border border-red-100"><XCircle size={18}/></button>
                                    <button onClick={() => handleAction(req.id, 'accept')} className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl hover:bg-green-600 transition-all font-black text-[10px] uppercase italic"><CheckCircle size={16}/> Accept & Hire</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FlightRequests;