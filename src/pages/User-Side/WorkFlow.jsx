import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserCheck, FileSearch, Send, PlaneTakeoff, 
  Search, HardHat, Landmark, Ticket, 
  ShieldCheck, Briefcase, Globe, Zap 
} from 'lucide-react';

const workflowData = {
  Job: [
    { id: '01', title: 'Skill Match', desc: 'Analyzing your CV for global roles.', icon: <Search size={28} />, color: 'from-blue-600 to-cyan-400' },
    { id: '02', title: 'Employer Interview', desc: 'Direct zoom calls with companies.', icon: <UserCheck size={28} />, color: 'from-blue-500 to-indigo-500' },
    { id: '03', title: 'Work Permit', desc: 'Legal documentation & contract sign.', icon: <HardHat size={28} />, color: 'from-indigo-600 to-purple-600' },
    { id: '04', title: 'Deployment', desc: 'Flight booking & job joining.', icon: <PlaneTakeoff size={28} />, color: 'from-purple-600 to-pink-600' },
  ],
  Visa: [
    { id: '01', title: 'Eligibility', desc: 'Free assessment of your profile.', icon: <ShieldCheck size={28} />, color: 'from-emerald-600 to-teal-400' },
    { id: '02', title: 'Doc Prep', desc: 'Notary & Embassy file readying.', icon: <FileSearch size={28} />, color: 'from-teal-500 to-cyan-500' },
    { id: '03', title: 'Submission', desc: 'VFS or Embassy appointment.', icon: <Landmark size={28} />, color: 'from-cyan-600 to-blue-600' },
    { id: '04', title: 'Stamping', desc: 'Final visa collection & briefing.', icon: <Zap size={28} />, color: 'from-blue-600 to-indigo-600' },
  ],
  Travel: [
    { id: '01', title: 'Plan Trip', desc: 'Customizing your dream destination.', icon: <Globe size={28} />, color: 'from-orange-600 to-yellow-400' },
    { id: '02', title: 'Booking', desc: 'Reserving 5-star hotels & flights.', icon: <Ticket size={28} />, color: 'from-orange-500 to-red-500' },
    { id: '03', title: 'Guide Connect', desc: 'Meeting your local tour experts.', icon: <UserCheck size={28} />, color: 'from-red-600 to-rose-600' },
    { id: '04', title: 'Take Off', desc: 'Start your luxury holiday experience.', icon: <PlaneTakeoff size={28} />, color: 'from-rose-500 to-purple-600' },
  ]
};

const WorkFlow = () => {
  const [activeTab, setActiveTab] = useState('Job');

  return (
    <section className="py-24 bg-slate-50 dark:bg-[#060606] transition-colors duration-500 relative overflow-hidden">
      
      {/* Decorative Rotating Animation Background */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        className="absolute -top-40 -right-40 w-[600px] h-[600px] border-[1px] border-blue-500/10 dark:border-blue-500/5 rounded-full pointer-events-none"
      />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black italic text-slate-900 dark:text-white uppercase tracking-tighter"
          >
            Our <span className="text-blue-600">WorkFlow</span>
          </motion.h2>
          
          {/* 🛠️ Modern Tab Switcher */}
          <div className="flex justify-center mt-12">
            <div className="flex p-1.5 bg-slate-200/50 dark:bg-zinc-900/50 backdrop-blur-xl rounded-[2rem] border border-slate-300/50 dark:border-white/5 shadow-inner">
              {Object.keys(workflowData).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-8 py-3 rounded-[1.8rem] text-xs font-black uppercase tracking-widest transition-all duration-500 ${
                    activeTab === tab ? 'text-white' : 'text-slate-500 dark:text-zinc-500'
                  }`}
                >
                  {activeTab === tab && (
                    <motion.div 
                      layoutId="activeFlowTab"
                      className="absolute inset-0 bg-blue-600 rounded-[1.8rem] shadow-lg shadow-blue-600/30"
                    />
                  )}
                  <span className="relative z-10">{tab}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 🚀 Horizontal Timeline Workflow */}
        <div className="relative">
          
          {/* Connecting Animated Line (Desktop Only) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-[2px] bg-slate-200 dark:bg-white/5 -translate-y-1/2">
             <motion.div 
               initial={{ width: "0%" }}
               whileInView={{ width: "100%" }}
               transition={{ duration: 2, ease: "easeInOut" }}
               className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]"
             />
          </div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4"
            >
              {workflowData[activeTab].map((step, index) => (
                <div key={index} className="relative group">
                  
                  {/* Step Card */}
                  <div className="relative z-10 p-8 rounded-[3rem] bg-white dark:bg-zinc-900/40 border border-slate-200 dark:border-white/5 backdrop-blur-xl hover:border-blue-500/50 dark:hover:border-blue-500/30 transition-all duration-500 flex flex-col items-center text-center group-hover:-translate-y-4 shadow-xl shadow-slate-200/50 dark:shadow-none">
                    
                    {/* Step ID Badge */}
                    <div className="absolute top-6 right-8 text-4xl font-black text-slate-100 dark:text-white/5 italic group-hover:text-blue-500/10 transition-colors">
                      {step.id}
                    </div>

                    {/* Icon with Glowing Effect */}
                    <div className={`w-20 h-20 rounded-[2rem] bg-gradient-to-br ${step.color} flex items-center justify-center text-white mb-8 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                      {step.icon}
                    </div>

                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic mb-4 tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-slate-500 dark:text-zinc-400 text-sm font-medium leading-relaxed max-w-[200px]">
                      {step.desc}
                    </p>

                    {/* Dot on the Timeline Line */}
                    <div className="hidden lg:block absolute -bottom-[45px] left-1/2 -translate-x-1/2">
                       <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-zinc-800 border-4 border-slate-50 dark:border-[#060606] group-hover:bg-blue-600 group-hover:scale-150 transition-all duration-500" />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Floating Rotating Element (Bottom Left) */}
        <motion.div 
           animate={{ 
             y: [0, -20, 0],
             rotate: [0, 10, 0]
           }}
           transition={{ duration: 6, repeat: Infinity }}
           className="absolute bottom-10 left-10 hidden xl:block opacity-20 dark:opacity-40"
        >
          <div className="p-6 rounded-3xl bg-blue-600/20 backdrop-blur-3xl border border-blue-500/20">
             <Zap size={40} className="text-blue-500" />
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default WorkFlow;