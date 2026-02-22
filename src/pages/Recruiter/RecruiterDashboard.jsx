import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  Users, Briefcase, Star, Clock, 
  MapPin, Zap, Plus, ShieldCheck, TrendingUp, Sparkles
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

const RecruiterDashboard = () => {
  const [data, setData] = useState({ stats: null, recentJobs: [], company: null, goal: { progress: 0 } });
  const [loading, setLoading] = useState(true);

  // Time-based Greeting Logic
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/jobs/dashboard-stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to sync with command center");
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#F8FAFC]">
      <div className="relative">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} 
          className="w-16 h-16 border-[3px] border-indigo-100 border-t-indigo-600 rounded-full shadow-inner" 
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-ping" />
        </div>
      </div>
      <p className="mt-6 text-[11px] font-black uppercase tracking-[0.5em] text-slate-400">Initializing Core</p>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="max-w-[1600px] mx-auto space-y-12 pb-20 px-8 pt-6"
    >
      <Toaster position="top-right" />
      
      {/* 👑 PREMIUM HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500 underline decoration-indigo-100 underline-offset-8">
              {getGreeting()} {data.company?.company_name }
            </span>
          </h2>
          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full shadow-sm">
               <ShieldCheck size={12} className="text-emerald-500" />
               <span className="text-[9px] font-black text-emerald-600 uppercase tracking-tighter">Verified Enterprise</span>
            </div>
            <div className="flex items-center gap-1.5 px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-full">
               <Sparkles size={12} className="text-amber-500" />
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter italic">Elite Status</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 📊 DYNAMIC STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard icon={<Briefcase />} label="Live Openings" value={data.stats?.liveVacancies} trend="Active" color="indigo" />
        <StatCard icon={<Users />} label="Total Talents" value={data.stats?.totalTalents} trend="Pool" color="blue" />
        <StatCard icon={<Star />} label="Shortlisted" value={data.stats?.shortlisted} trend="Selection" color="rose" />
        <StatCard icon={<Zap />} label="Hire Velocity" value={data.stats?.hireRate} trend="Avg. Days" color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* 🌿 RECENT CIRCULARS */}
        <div className="lg:col-span-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-[60px] p-12 border border-white shadow-[0_30px_100px_rgba(0,0,0,0.04)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            
            <div className="flex justify-between items-center mb-12 relative z-10">
               <div>
                 <h3 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter">Live Campaigns</h3>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time engagement metrics</p>
               </div>
               <button className="p-4 bg-slate-50 rounded-2xl hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-all shadow-sm">
                  <TrendingUp size={20} />
               </button>
            </div>
            
            <div className="space-y-6 relative z-10">
              <AnimatePresence>
                {data.recentJobs.length > 0 ? data.recentJobs.map((job, idx) => (
                  <JobRow 
                    key={job.id} 
                    index={idx} 
                    title={job.title} 
                    type={job.job_type} 
                    applicants={job.app_count} 
                    location={job.location} 
                    status={job.status} 
                  />
                )) : (
                  <div className="py-24 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-[30px] flex items-center justify-center mx-auto mb-6">
                      <Briefcase size={32} className="text-slate-200" />
                    </div>
                    <p className="text-slate-400 font-black uppercase text-xs tracking-widest italic">No Active Tracking Found</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* 🎯 GOAL TRACKING CARD */}
        <div className="lg:col-span-4">
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-[#111827] rounded-[60px] p-12 text-white h-full shadow-[0_40px_80px_rgba(0,0,0,0.15)] relative overflow-hidden flex flex-col justify-between"
          >
             {/* Decorative Background Elements */}
             <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-600/20 rounded-full blur-[80px]" />
             <div className="absolute bottom-0 left-0 w-32 h-32 bg-violet-600/10 rounded-full blur-[60px]" />

             <div className="relative z-10">
               <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10">
                    <TrendingUp size={22} className="text-indigo-400" />
                  </div>
                  <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Target Milestone</h4>
               </div>

               <div className="space-y-2 mb-10">
                  <div className="flex items-baseline justify-between">
                    <span className="text-7xl font-black italic tracking-tighter leading-none">{data.goal.progress}%</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Achieved</span>
                  </div>
                  <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest pl-1">Monthly Recruitment Goal</p>
               </div>

               <div className="relative h-20 w-full bg-white/5 rounded-[30px] border border-white/5 flex items-center px-6 overflow-hidden">
                  <div className="w-full">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3 text-slate-400">
                      <span>Velocity</span>
                      <span className="text-white">{data.goal.current} / {data.goal.target}</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${data.goal.progress}%` }} 
                        transition={{ duration: 2, ease: "circOut" }} 
                        className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]" 
                      />
                    </div>
                  </div>
               </div>
             </div>

             <div className="relative z-10 mt-12 pt-10 border-t border-white/5">
                <p className="text-[13px] text-slate-400 font-medium italic leading-relaxed">
                   Vaiya, you are <span className="text-white font-black">{data.goal.target - data.goal.current} candidates</span> away from your monthly target. Keep the momentum high! 🚀
                </p>
             </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// --- ELITE UI ATOMS ---

const StatCard = ({ icon, label, value, trend, color }) => {
  const themes = {
    indigo: "from-indigo-500 to-indigo-600 shadow-indigo-100 text-indigo-600 bg-indigo-50",
    blue: "from-blue-500 to-blue-600 shadow-blue-100 text-blue-600 bg-blue-50",
    rose: "from-rose-500 to-rose-600 shadow-rose-100 text-rose-600 bg-rose-50",
    amber: "from-amber-500 to-amber-600 shadow-amber-100 text-amber-600 bg-amber-50",
  };

  return (
    <motion.div 
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
      className="bg-white p-10 rounded-[50px] border border-slate-50 shadow-[0_20px_60px_rgba(0,0,0,0.02)] hover:shadow-2xl transition-all relative group overflow-hidden"
    >
      <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-8 ${themes[color].split(' ')[4]} ${themes[color].split(' ')[3]} group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
        {React.cloneElement(icon, { size: 30, strokeWidth: 2.5 })}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 italic">{label}</p>
      <div className="flex items-end justify-between">
        <h4 className="text-5xl font-black text-slate-900 italic tracking-tighter leading-none">{value || "0"}</h4>
        <div className="text-right">
          <div className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter">{trend}</div>
          <div className="w-6 h-0.5 bg-indigo-100 mt-1 ml-auto" />
        </div>
      </div>
    </motion.div>
  );
};

const JobRow = ({ title, type, applicants, location, status, index }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ delay: index * 0.1 }}
    className="flex items-center justify-between p-8 rounded-[40px] bg-slate-50/40 border border-transparent hover:border-slate-100 hover:bg-white hover:shadow-xl transition-all group cursor-pointer"
  >
    <div className="flex items-center gap-8">
      <div className="w-16 h-16 bg-white rounded-[24px] flex items-center justify-center shadow-lg group-hover:rotate-6 transition-all border border-slate-50">
        <span className="text-2xl font-black italic text-indigo-600">{title ? title.charAt(0) : 'J'}</span>
      </div>
      <div>
        <h4 className="text-xl font-black text-slate-800 uppercase italic tracking-tighter mb-1.5">{title}</h4>
        <div className="flex gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
          <span className="flex items-center gap-2 px-3 py-1 bg-white rounded-full shadow-sm">
            <MapPin size={12} className="text-indigo-400"/> {location}
          </span>
          <span className="flex items-center gap-2 px-3 py-1 bg-white rounded-full shadow-sm">
            <Clock size={12} className="text-indigo-400"/> {type}
          </span>
        </div>
      </div>
    </div>
    <div className="flex items-center gap-14">
      <div className="text-right">
        <p className="text-3xl font-black text-slate-800 italic leading-none">{applicants || 0}</p>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">Applicants</p>
      </div>
      <div className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm ${
        status === 'active' ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
      }`}>
        {status}
      </div>
    </div>
  </motion.div>
);

export default RecruiterDashboard;