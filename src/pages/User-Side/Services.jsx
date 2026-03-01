import React from 'react';
import { motion } from 'framer-motion';
import { 
  HardHat, Hotel, Monitor, GraduationCap, 
  Palmtree, Briefcase, HeartPulse, Truck 
} from 'lucide-react';

const serviceList = [
  { icon: <HardHat size={30} />, title: "Construction", desc: "Civil engineers, supervisors & skilled labor for global projects.", color: "blue" },
  { icon: <Monitor size={30} />, title: "IT & Tech", desc: "Software developers, data analysts & IT support experts.", color: "indigo" },
  { icon: <Hotel size={30} />, title: "Hospitality", desc: "5-star hotel staff, chefs & management roles in Europe & UAE.", color: "amber" },
  { icon: <GraduationCap size={30} />, title: "Student Visa", desc: "Complete admission & visa processing for top universities.", color: "purple" },
  { icon: <Palmtree size={30} />, title: "Luxury Tours", desc: "Premium holiday packages with 5-star accommodation.", color: "emerald" },
  { icon: <HeartPulse size={30} />, title: "Healthcare", desc: "Nurses, doctors & laboratory technicians for global clinics.", color: "rose" },
  { icon: <Truck size={30} />, title: "Logistics", desc: "Heavy vehicle drivers & warehouse management specialists.", color: "orange" },
  { icon: <Briefcase size={30} />, title: "Business Visa", desc: "Investor & entrepreneur visa processing for startups.", color: "cyan" },
];

const Services = () => {
  return (
    <section className="py-24 bg-white dark:bg-[#060606] transition-colors duration-500">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-5xl md:text-7xl font-black italic uppercase text-slate-900 dark:text-white tracking-tighter">
              Specialized <span className="text-blue-600">Industries</span>
            </h2>
            <p className="text-slate-500 dark:text-zinc-400 mt-4 font-medium text-lg">
              Expert solutions tailored for the world's most demanding sectors.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceList.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -10 }}
              transition={{ delay: index * 0.1 }}
              className="group p-8 rounded-[2.5rem] bg-slate-50 dark:bg-zinc-900/40 border border-slate-200 dark:border-white/5 hover:border-blue-500/50 transition-all duration-500"
            >
              <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center bg-${service.color}-500/10 text-${service.color}-600 dark:text-${service.color}-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm`}>
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight uppercase italic">{service.title}</h3>
              <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;