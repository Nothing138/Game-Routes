import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Briefcase, FileText, DollarSign, Clock, TrendingUp, Calendar } from 'lucide-react';

const Analytics = () => {
    const [data, setData] = useState(null);
    const [filter, setFilter] = useState('month');
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/admin/stats?filter=${filter}`);
            if (res.data.success) setData(res.data);
        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [filter]);

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-[#07090c] text-red-600 font-black italic animate-pulse">
            LOADING PREMIUM SYSTEM ANALYTICS...
        </div>
    );

    return (
        <div className="p-6 md:p-10 min-h-screen bg-[#07090c] text-zinc-300 font-sans">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div>
                    <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter">
                        ANALYTICS <span className="text-red-600">DASHBOARD</span>
                    </h2>
                    <p className="text-zinc-500 text-xs mt-1 font-bold uppercase tracking-widest">Real-time business performance tracking</p>
                </div>

                {/* Filter Switcher */}
                <div className="flex p-1 bg-[#11141a] border border-zinc-800 rounded-2xl shadow-2xl">
                    {['week', 'month'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all duration-300 ${
                                filter === type ? 'bg-red-600 text-white shadow-lg' : 'text-zinc-500 hover:text-white'
                            }`}
                        >
                            {type === 'week' ? 'Weekly View' : 'Monthly View'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <StatCard label="Total Revenue" val={`$${data.stats.totalRevenue}`} icon={<DollarSign color="#ef4444"/>} color="border-red-600/20" />
                <StatCard label="Candidates" val={data.stats.totalUsers} icon={<Users color="#3b82f6"/>} color="border-blue-600/20" />
                <StatCard label="Open Positions" val={data.stats.totalJobs} icon={<Briefcase color="#10b981"/>} color="border-emerald-600/20" />
                <StatCard label="Total Apps" val={data.stats.totalApps} icon={<FileText color="#f59e0b"/>} color="border-orange-600/20" />
            </div>

            {/* Main Chart Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <div className="lg:col-span-2 bg-[#11141a] border border-zinc-800 p-8 rounded-[40px] shadow-2xl relative overflow-hidden">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-white font-black italic uppercase tracking-tighter flex items-center gap-2">
                            <TrendingUp size={20} className="text-red-600"/> Income Growth
                        </h3>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.chartData}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                                <XAxis dataKey="label" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} tick={{fill: '#9ca3af', fontWeight: 'bold'}} />
                                <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} tick={{fill: '#9ca3af'}} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#07090c', border: '1px solid #27272a', borderRadius: '15px' }}
                                    itemStyle={{ color: '#ef4444', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="income" stroke="#ef4444" strokeWidth={4} fillOpacity={1} fill="url(#colorIncome)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Side Table - Recent Bookings */}
                <div className="bg-[#11141a] border border-zinc-800 rounded-[40px] overflow-hidden flex flex-col shadow-2xl">
                    <div className="p-6 border-b border-zinc-800 font-black italic uppercase text-white flex items-center gap-2">
                        <Clock className="text-red-600" size={18} /> Recent Activity
                    </div>
                    <div className="flex-1 overflow-y-auto max-h-[400px]">
                        {data.recentBookings.map((b) => (
                            <div key={b.id} className="p-4 border-b border-zinc-800/50 hover:bg-white/5 transition-all flex justify-between items-center">
                                <div>
                                    <p className="text-white text-xs font-black uppercase italic">{b.client_name}</p>
                                    <p className="text-zinc-500 text-[10px] font-bold">{b.package}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-white text-xs font-black">${b.price}</p>
                                    <span className="text-[8px] font-black uppercase text-red-600 tracking-tighter bg-red-600/10 px-2 py-0.5 rounded-full">{b.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ label, val, icon, color }) => (
    <div className={`bg-[#11141a] border ${color} p-8 rounded-[35px] hover:scale-105 transition-all duration-500 shadow-xl group`}>
        <div className="mb-4 bg-zinc-900/50 w-fit p-3 rounded-2xl group-hover:bg-red-600/10 transition-colors">{icon}</div>
        <h4 className="text-4xl font-black text-white tracking-tighter mb-1">{val}</h4>
        <p className="text-[10px] uppercase text-zinc-500 font-black italic tracking-widest">{label}</p>
    </div>
);

export default Analytics;