import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Globe, Briefcase, MapPin, Users, AlertCircle, ChevronRight } from 'lucide-react';

const DashboardHome = () => {
  // State to store real data from backend
  const [statsData, setStatsData] = useState({
    visaRequests: 0,
    activeJobs: 0,
    tourPackages: 0,
    totalClients: 0
  });
  const [loading, setLoading] = useState(true);

  // Fetch data from backend when page loads
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/dashboard-stats');
        setStatsData(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Dashboard stats fetch error:", err);
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { title: 'Visa Requests', value: statsData.visaRequests, icon: <Globe />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Open Jobs', value: statsData.activeJobs, icon: <Briefcase />, color: 'text-orange-600', bg: 'bg-orange-50' },
    { title: 'Tour Packages', value: statsData.tourPackages, icon: <MapPin />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Total Clients', value: statsData.totalClients, icon: <Users />, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Welcome Banner */}
      <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <Globe size={120} className="text-red-600" />
        </div>
        <div className="relative z-10">
            <h1 className="text-3xl font-black text-gray-900 italic uppercase tracking-tighter">
              Welcome to <span className="text-red-600">Game Routes Agency</span>
            </h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[3px] mt-2 italic">
              Empowering your travel and career journeys.
            </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-7 rounded-[35px] border border-gray-100 shadow-sm hover:bg-slate-900 group transition-all duration-500 cursor-default">
            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-5 group-hover:rotate-[360deg] transition-all duration-700`}>
              {stat.icon}
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-white/60 transition-colors">{stat.title}</p>
            <h3 className="text-3xl font-black text-gray-900 mt-2 italic group-hover:text-white transition-colors">
                {loading ? "..." : stat.value}
            </h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Table */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div>
                <h3 className="font-black text-gray-900 italic uppercase leading-none">Recent Activity</h3>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-[2px] mt-1">Live updates from your database</p>
            </div>
            <button className="text-[10px] font-black uppercase text-red-600 hover:underline tracking-widest">View All</button>
          </div>
          
          <div className="space-y-4">
             {/* Simple Placeholder for data loading */}
             <div className="border-l-4 border-red-600 bg-gray-50 p-4 rounded-r-2xl flex items-center justify-between">
                <div>
                    <p className="text-xs font-black italic uppercase text-gray-700">New Visa Application</p>
                    <p className="text-[10px] font-bold text-gray-400">Client: Abir Rahman - Destination: Poland</p>
                </div>
                <span className="text-[9px] font-black text-gray-400 uppercase">2 Mins Ago</span>
             </div>
             
             <div className="border-l-4 border-slate-900 bg-gray-50 p-4 rounded-r-2xl flex items-center justify-between">
                <div>
                    <p className="text-xs font-black italic uppercase text-gray-700">Job Circular Posted</p>
                    <p className="text-[10px] font-bold text-gray-400">Title: IT Support Specialist - Canada</p>
                </div>
                <span className="text-[9px] font-black text-gray-400 uppercase">1 Hour Ago</span>
             </div>
          </div>
        </div>

        {/* Notifications Sidebar */}
        <div className="bg-[#0F172A] rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute -bottom-10 -right-10 opacity-5">
              <AlertCircle size={200} />
          </div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center animate-pulse">
                <AlertCircle className="text-white" size={20} />
            </div>
            <h3 className="text-lg font-black italic uppercase leading-none tracking-tighter">Live <br/> Inquiries</h3>
          </div>
          
          <div className="space-y-3 relative z-10">
             {[1, 2, 3].map(i => (
               <div key={i} className="bg-white/5 border border-white/10 p-5 rounded-[25px] flex items-center justify-between hover:bg-white/10 transition-all cursor-pointer group">
                 <div>
                    <div className="text-[11px] font-black italic text-gray-200 uppercase">Poland Work Visa</div>
                    <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">Inquiry from S. Hasan</div>
                 </div>
                 <ChevronRight size={16} className="text-red-500 group-hover:translate-x-1 transition-transform" />
               </div>
             ))}
          </div>
          
          <button className="w-full mt-6 py-4 bg-red-600 rounded-2xl text-[10px] font-black uppercase italic tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-900/40">
            Check All Inbox
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;