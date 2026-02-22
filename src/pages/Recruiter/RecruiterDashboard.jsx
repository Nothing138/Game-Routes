import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Briefcase, Star, ArrowUpRight, 
  TrendingUp, Clock, MapPin, Zap, MousePointer2 
} from 'lucide-react';

const RecruiterDashboard = () => {
  // Dynamic Greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Shubho Shokal" : hour < 18 ? "Shubho Oporahno" : "Shubho Shondha";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10 pb-10"
    >
      {/* 👋 WELCOME HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight italic uppercase">
            {greeting}, <span className="text-indigo-600">Vaiya!</span>
          </h2>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-[2px] mt-1">
            Ready to hunt some top-tier global talent?
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 px-4 rounded-2xl border border-slate-100 shadow-sm">
           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
           <span className="text-[10px] font-black text-slate-500 uppercase italic">System Status: Optimal</span>
        </div>
      </div>

      {/* 📊 ELITE ANALYTICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Briefcase size={20}/>} label="Live Vacancies" value="08" trend="+2 New" color="bg-indigo-500" light="bg-indigo-50" />
        <StatCard icon={<Users size={20}/>} label="Total Talents" value="1,240" trend="+12% Up" color="bg-blue-500" light="bg-blue-50" />
        <StatCard icon={<Star size={20}/>} label="Shortlisted" value="42" trend="In Review" color="bg-rose-500" light="bg-rose-50" />
        <StatCard icon={<Zap size={20}/>} label="Hire Rate" value="94%" trend="Excellent" color="bg-amber-500" light="bg-amber-50" />
      </div>

      {/* 🏛️ TWO COLUMN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 🌿 Recent Job Postings (Left Column) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-black text-slate-800 uppercase italic flex items-center gap-3">
                <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span> Active Circulars
              </h3>
              <button className="text-[10px] font-black uppercase text-indigo-600 hover:underline tracking-widest transition-all">View All Jobs</button>
            </div>

            <div className="space-y-4">
              <JobRow title="Senior React Developer" type="Full Time" applicants="48" location="Dubai, UAE" status="Active" />
              <JobRow title="Creative UI/UX Lead" type="Remote" applicants="126" location="London, UK" status="Review" />
              <JobRow title="Backend Engineer (Node)" type="Contract" applicants="12" location="Riyadh, KSA" status="Active" />
            </div>
          </div>
        </div>

        {/* ⚡ Quick Insights & Actions (Right Column) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Actions Card */}
          <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl shadow-slate-200 relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="text-xl font-black italic uppercase mb-2">Power <span className="text-indigo-400 text-sm">Actions</span></h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6 italic opacity-70">Execute recruitment tasks</p>
              
              <div className="space-y-3">
                <ActionButton icon={<TrendingUp size={16}/>} label="Boost Listings" />
                <ActionButton icon={<Users size={16}/>} label="Bulk Interview" />
                <ActionButton icon={<MousePointer2 size={16}/>} label="Export Talent Data" />
              </div>
            </div>
            {/* Background Glow */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl transition-all group-hover:bg-indigo-500/30"></div>
          </div>

          {/* Hiring Progress Card */}
          <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[3px] mb-6">Target Milestone</h4>
            <div className="flex items-end justify-between mb-2">
               <span className="text-3xl font-black text-slate-800 italic leading-none">75%</span>
               <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest italic">15/20 Hires</span>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: '75%' }}
                 transition={{ duration: 1, ease: "easeOut" }}
                 className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full"
               />
            </div>
            <p className="mt-4 text-[11px] text-slate-400 font-medium italic leading-relaxed">
              Vaiya, you're almost there! Just 5 more hires to hit this month's recruitment goal. 🏜️🚀
            </p>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

// --- Atomic Components ---

const StatCard = ({ icon, label, value, trend, color, light }) => (
  <div className="bg-white p-7 rounded-[35px] border border-slate-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
    <div className={`w-12 h-12 ${light} ${color.replace('bg-', 'text-')} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{label}</p>
    <div className="flex items-baseline justify-between mt-1">
      <h4 className="text-3xl font-black text-slate-800 italic tracking-tighter leading-none">{value}</h4>
      <span className="text-[9px] font-black text-indigo-600 uppercase italic opacity-0 group-hover:opacity-100 transition-opacity">{trend}</span>
    </div>
  </div>
);

const JobRow = ({ title, type, applicants, location, status }) => (
  <div className="flex flex-col sm:flex-row items-center justify-between p-5 rounded-[28px] bg-slate-50/50 hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-xl transition-all cursor-pointer group">
    <div className="flex items-center gap-5">
      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-50 group-hover:rotate-6 transition-all font-black text-indigo-600 italic">
        {title.charAt(0)}
      </div>
      <div>
        <h4 className="font-black text-slate-800 text-sm uppercase italic tracking-tight">{title}</h4>
        <div className="flex items-center gap-3 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider italic">
          <span className="flex items-center gap-1"><MapPin size={10}/> {location}</span>
          <span className="flex items-center gap-1"><Clock size={10}/> {type}</span>
        </div>
      </div>
    </div>
    <div className="flex items-center gap-8 mt-4 sm:mt-0">
      <div className="text-center">
        <p className="text-sm font-black text-slate-800 leading-none italic">{applicants}</p>
        <p className="text-[9px] font-black text-slate-400 uppercase mt-1 italic tracking-widest">Applied</p>
      </div>
      <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase italic tracking-widest ${status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
        {status}
      </div>
      <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
         <ArrowUpRight size={18} />
      </div>
    </div>
  </div>
);

const ActionButton = ({ icon, label }) => (
  <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all group">
     <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg group-hover:bg-indigo-500 group-hover:text-white transition-all">{icon}</div>
        <span className="text-[10px] font-black uppercase italic tracking-widest">{label}</span>
     </div>
     <ArrowUpRight size={14} className="opacity-40 group-hover:opacity-100" />
  </button>
);

export default RecruiterDashboard;