import React from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, Globe2, PlaneTakeoff, ShieldCheck, 
  Zap, Headphones, ArrowUpRight, BarChart3, 
  Fingerprint, Scale 
} from 'lucide-react';

const featureData = [
  {
    icon: <Briefcase size={28} />,
    title: "Global Jobs",
    desc: "Direct placement with top-tier employers across Europe, UAE & Asia.",
    tag: "Work",
    color: "from-blue-600 to-cyan-500",
    grid: "md:col-span-2",
    delay: 0.1
  },
  {
    icon: <Globe2 size={28} />,
    title: "Visa Expert",
    desc: "99% Success rate in documentation.",
    tag: "Legal",
    color: "from-purple-600 to-indigo-500",
    grid: "md:col-span-1",
    delay: 0.2
  },
  {
    icon: <Fingerprint size={28} />,
    title: "Real-time Tracking",
    desc: "Live updates on your application status.",
    tag: "Tech",
    color: "from-emerald-600 to-teal-500",
    grid: "md:col-span-1",
    delay: 0.3
  },
  {
    icon: <PlaneTakeoff size={28} />,
    title: "Elite Travel",
    desc: "Bespoke itineraries for the modern explorer.",
    tag: "Leisure",
    color: "from-rose-600 to-orange-500",
    grid: "md:col-span-2",
    delay: 0.4
  },
  {
    icon: <Scale size={28} />,
    title: "Legal Assurance",
    desc: "Every contract is vetted by legal experts.",
    tag: "Safety",
    color: "from-amber-600 to-orange-400",
    grid: "md:col-span-1",
    delay: 0.5
  },
  {
    icon: <BarChart3 size={28} />,
    title: "Price Control",
    desc: "No hidden fees. Full transparency always.",
    tag: "Finance",
    color: "from-violet-600 to-fuchsia-500",
    grid: "md:col-span-2",
    delay: 0.6
  }
];

const Features = () => {
  return (
    <section className="py-24 bg-slate-50 dark:bg-[#080808] transition-colors duration-500 relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/5 dark:bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/5 dark:bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Animated Header */}
        <div className="max-w-3xl mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-6"
          >
             </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white italic uppercase leading-none tracking-tighter"
          >
            Our <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Capabilities</span>
          </motion.h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featureData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: item.delay, duration: 0.5 }}
              className={`${item.grid} group relative overflow-hidden rounded-[2.5rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-zinc-900/40 p-8 hover:shadow-2xl transition-all duration-500`}
            >
              {/* Animated Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-[0.03] dark:group-hover:opacity-[0.07] transition-opacity duration-500`} />
              
              <div className="relative z-10 h-full flex flex-col">
                <div className="flex justify-between items-start mb-10">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-xl`}>
                    {item.icon}
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.1, rotate: 45 }}
                    className="p-3 rounded-full bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-white/30 group-hover:text-blue-500 transition-colors"
                  >
                    <ArrowUpRight size={20} />
                  </motion.button>
                </div>

                <div>
                  <span className="text-[10px] font-black uppercase tracking-[3px] text-blue-600 dark:text-blue-400 mb-3 block">
                    {item.tag}
                  </span>
                  <h3 className="text-2xl font-black italic uppercase text-slate-900 dark:text-white mb-4 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 dark:text-zinc-400 font-medium leading-snug">
                    {item.desc}
                  </p>
                </div>

                {/* Sub-features or visual element for large cards */}
                {item.grid.includes('col-span-2') && (
                   <div className="mt-8 pt-8 border-t border-slate-100 dark:border-white/5 flex gap-6">
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={14} className="text-emerald-500" />
                        <span className="text-[9px] font-bold dark:text-zinc-500 uppercase">Verified</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap size={14} className="text-amber-500" />
                        <span className="text-[9px] font-bold dark:text-zinc-500 uppercase">Instant</span>
                      </div>
                   </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;