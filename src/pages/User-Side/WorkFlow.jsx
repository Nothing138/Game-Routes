import React from 'react';
import { motion } from 'framer-motion';
import { UserCheck, FileSearch, Send, PlaneTakeoff } from 'lucide-react';

const steps = [
  {
    id: '01',
    title: 'Profile Assessment',
    desc: 'We analyze your documents and eligibility for the specific country.',
    icon: <UserCheck size={32} />,
    color: 'from-blue-500 to-cyan-400'
  },
  {
    id: '02',
    title: 'Document Processing',
    desc: 'Legalization and translation of all necessary recruitment papers.',
    icon: <FileSearch size={32} />,
    color: 'from-purple-500 to-blue-500'
  },
  {
    id: '03',
    title: 'Submission & Interview',
    desc: 'Direct contact with global employers and embassy submission.',
    icon: <Send size={32} />,
    color: 'from-orange-500 to-red-500'
  },
  {
    id: '04',
    title: 'Visa & Departure',
    desc: 'Final visa stamping and flight booking for your new journey.',
    icon: <PlaneTakeoff size={32} />,
    color: 'from-emerald-500 to-teal-500'
  }
];

const WorkFlow = () => {
  return (
    <section className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black italic text-white uppercase tracking-tighter"
          >
            How It <span className="text-blue-500">Works</span>
          </motion.h2>
          <p className="text-slate-500 mt-4 font-bold uppercase tracking-widest text-xs">Our 4-Step Success Formula</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="relative p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-all"
            >
              <div className="text-5xl font-black text-white/10 absolute top-6 right-8 italic">{step.id}</div>
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white mb-6 shadow-lg`}>
                {step.icon}
              </div>
              <h3 className="text-xl font-black text-white uppercase italic mb-3 tracking-tight">{step.title}</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkFlow;