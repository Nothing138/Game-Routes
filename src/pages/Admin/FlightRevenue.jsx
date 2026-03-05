import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Plane, CheckCircle, Users, ArrowUpRight, TrendingUp, MapPin, ClipboardList, Phone } from 'lucide-react';

const FlightRevenue = () => {
    const [data, setData] = useState(null);
    const [range, setRange] = useState('monthly');
    const [loading, setLoading] = useState(true);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`http://localhost:5000/api/admin/flight-analytics?range=${range}`);
            setData(res.data);
        } catch (err) {
            console.error("Error fetching analytics:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, [range]);

    if (loading || !data) return (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-red-600 mb-4"></div>
            <p className="p-10 font-black text-center uppercase italic tracking-widest">Generating Financial Reports...</p>
        </div>
    );

    return (
        <div className="space-y-8 pb-10 bg-[#f8fafc] p-4 lg:p-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none">
                        REVENUE <span className="text-red-600">INSIGHTS</span>
                    </h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em] mt-2">
                        Real-time Financial Performance & Flight Statistics
                    </p>
                </div>
                <div className="flex bg-black p-1.5 rounded-2xl shadow-lg">
                    <button 
                        onClick={() => setRange('weekly')} 
                        className={`px-6 py-2 text-[10px] font-black uppercase italic rounded-xl transition-all duration-300 ${range === 'weekly' ? 'bg-red-600 text-white shadow-inner' : 'text-gray-400 hover:text-white'}`}
                    >
                        Weekly
                    </button>
                    <button 
                        onClick={() => setRange('monthly')} 
                        className={`px-6 py-2 text-[10px] font-black uppercase italic rounded-xl transition-all duration-300 ${range === 'monthly' ? 'bg-red-600 text-white shadow-inner' : 'text-gray-400 hover:text-white'}`}
                    >
                        Monthly
                    </button>
                </div>
            </div>

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Revenue" value={`$${data.stats.total_revenue || 0}`} icon={<DollarSign/>} color="bg-green-500" />
                <StatCard title="Total Flights" value={data.stats.total_flights || 0} icon={<Plane/>} color="bg-blue-600" />
                <StatCard title="Confirmed" value={data.stats.confirmed_bookings || 0} icon={<CheckCircle/>} color="bg-red-600" />
                <StatCard title="Pending" value={data.stats.pending_requests || 0} icon={<Users/>} color="bg-orange-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Revenue Flow Chart */}
                <div className="lg:col-span-2 bg-white border-2 border-black rounded-[2.5rem] p-8 relative overflow-hidden shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all duration-300">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="font-black uppercase italic text-xl tracking-tight flex items-center gap-2">
                                <TrendingUp className="text-red-600" /> Revenue Flow
                            </h3>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Earnings trend based on {range} data</p>
                        </div>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.graphData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#64748b'}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#64748b'}} />
                                <Tooltip 
                                    contentStyle={{borderRadius: '16px', border: '2px solid black', fontWeight: 'black', textTransform: 'uppercase', fontSize: '12px'}}
                                    cursor={{stroke: '#dc2626', strokeWidth: 2}}
                                />
                                <Area type="monotone" dataKey="value" stroke="#dc2626" strokeWidth={5} fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Success List */}
                <div className="bg-black text-white rounded-[2.5rem] p-8 shadow-[10px_10px_0px_0px_rgba(220,38,38,1)] flex flex-col">
                    <h3 className="font-black uppercase italic text-xl mb-8 flex items-center gap-2">
                        <ArrowUpRight className="text-red-500" /> Recent Hired
                    </h3>
                    <div className="space-y-6 flex-grow">
                        {data.recentList && data.recentList.length > 0 ? data.recentList.map((item, i) => (
                            <div key={i} className="flex justify-between items-center group cursor-default">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center border border-gray-800 group-hover:border-red-500 transition-colors">
                                        <span className="font-black text-red-500 text-xs">{item.full_name.charAt(0)}</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm uppercase italic group-hover:text-red-500 transition-colors">{item.full_name}</p>
                                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{item.destination_city}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-red-500 italic text-lg">${item.total_cost}</p>
                                    <span className="text-[8px] bg-red-600 text-white px-2 py-0.5 rounded-md uppercase font-black tracking-tighter italic">Paid</span>
                                </div>
                            </div>
                        )) : (
                            <p className="text-gray-500 text-xs font-bold uppercase text-center mt-10">No recent bookings</p>
                        )}
                    </div>
                    <button className="w-full mt-8 py-4 border-2 border-dashed border-gray-700 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:border-red-500 hover:text-red-500 transition-all">
                        View All Activity
                    </button>
                </div>
            </div>

            {/* Detailed Analytics Table - Bomb Level UI */}
            <div className="bg-white border-2 border-black rounded-[2.5rem] p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-red-600 rounded-2xl text-white shadow-lg shadow-red-200">
                        <ClipboardList size={24} />
                    </div>
                    <div>
                        <h3 className="font-black uppercase italic text-2xl tracking-tighter leading-none">Flight Audit <span className="text-red-600">Log</span></h3>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Full breakdown of accepted flight requests</p>
                    </div>
                </div>
                
                <div className="overflow-x-auto rounded-2xl border border-gray-100">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="bg-slate-50 border-b-2 border-black">
                                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Candidate Info</th>
                                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Identity Details</th>
                                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Journey Path</th>
                                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Schedule</th>
                                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Settled Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.recentList.map((item, i) => (
                                <tr key={i} className="group border-b border-slate-50 hover:bg-slate-50/50 transition-all">
                                    <td className="p-5">
                                        <div className="flex items-center gap-3">
                                            <div>
                                                <p className="font-black text-sm uppercase italic group-hover:text-red-600 transition-colors">{item.full_name}</p>
                                                <p className="text-[10px] text-gray-400 font-bold flex items-center gap-1 uppercase italic"><Phone size={10}/> {item.contact_number || '016XXXXXXXX'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className="bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 inline-block">
                                            <p className="text-[10px] font-black text-slate-600 uppercase italic tracking-tighter">Passport: {item.passport_number || 'A12345678'}</p>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex items-center gap-2">
                                            <div className="text-center">
                                                <p className="text-[10px] font-black uppercase italic">{item.departure_city || 'DAC'}</p>
                                            </div>
                                            <div className="h-[2px] w-8 bg-slate-200 relative">
                                                <Plane size={10} className="absolute -top-1 left-1/2 -translate-x-1/2 text-red-600" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[10px] font-black uppercase italic text-red-600">{item.destination_city || 'DXB'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <p className="text-xs font-bold text-slate-700">{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                        <span className="text-[8px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase font-black italic">Confirmed</span>
                                    </td>
                                    <td className="p-5 text-right">
                                        <p className="font-black text-xl text-black tracking-tighter italic">${item.total_cost}</p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// Sub-component for Cards
const StatCard = ({ title, value, icon, color }) => (
    <div className="group relative">
        <div className="absolute inset-0 bg-black rounded-[2rem] translate-x-1.5 translate-y-1.5 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300"></div>
        <div className="relative bg-white border-2 border-black rounded-[2rem] p-6 flex items-center gap-5">
            <div className={`w-14 h-14 ${color} text-white rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:scale-110 transition-transform duration-300`}>
                {React.cloneElement(icon, { size: 28 })}
            </div>
            <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</p>
                <h4 className="text-3xl font-black italic tracking-tighter text-black">{value}</h4>
            </div>
        </div>
    </div>
);

export default FlightRevenue;