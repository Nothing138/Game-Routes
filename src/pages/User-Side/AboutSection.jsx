import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Headphones, Star, Building2, ArrowRight, Quote } from 'lucide-react';

const AboutSection = () => {
  const [index, setIndex] = useState(0);
  const [activeStat, setActiveStat] = useState(0);

  // 📝 Auto-changing Content Loop
  const aboutData = [
    {
      title: "Europe's Top Immigration Consultant",
      description: "Established in 2009, we provide tailored B2B and B2C immigration services. With offices in Poland, Portugal, and Germany.",
      badge: "16+ Years Experience",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Global Recruitment Leaders",
      description: "Our strong focus on customer satisfaction and lawful processes has built a loyal client base of over 20,000 successful solutions.",
      badge: "Trusted Worldwide",
      image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800"
    }
  ];

  // 📊 Stats Data
  const stats = [
    { icon: <Users />, label: "Applicants", value: "5000+", sub: "Successful Cases" },
    { icon: <Headphones />, label: "Counseled", value: "4M+", sub: "Consultations" },
    { icon: <Star />, label: "Experts", value: "150+", sub: "Specialists" },
    { icon: <Building2 />, label: "Offices", value: "12", sub: "Global Hubs" }
  ];

  // 🔄 Timing Logic
  useEffect(() => {
    const mainInterval = setInterval(() => {
      setIndex((prev) => (prev + 1) % aboutData.length);
    }, 6000);

    const statInterval = setInterval(() => {
      setActiveStat((prev) => (prev + 1) % stats.length);
    }, 1500); // Prottek 1.5 second-e highlight change hobe

    return () => {
      clearInterval(mainInterval);
      clearInterval(statInterval);
    };
  }, [aboutData.length, stats.length]);

  return (
    <section className="py-12 md:py-24 bg-white dark:bg-[#080808] overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          
          {/* 🖼️ LEFT: IMAGE SECTION (Responsive Height) */}
          <div className="relative w-full lg:w-1/2 h-[400px] md:h-[600px]">
            <AnimatePresence mode="wait">
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl z-10 border-4 md:border-8 border-slate-100 dark:border-white/5"
              >
                <img src={aboutData[index].image} alt="About" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* Floating Experience Badge (Smaller on Mobile) */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute -bottom-4 -right-2 md:-bottom-8 md:-right-8 bg-yellow-400 text-black px-5 py-4 md:px-8 md:py-6 rounded-2xl md:rounded-3xl shadow-2xl z-20"
            >
              <p className="text-xl md:text-3xl font-black italic leading-none">{aboutData[index].badge.split(' ')[0]}</p>
              <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest mt-1 md:mt-2">Experience</p>
            </motion.div>
          </div>

          {/* 📝 RIGHT: CONTENT & STATS GRID */}
          <div className="w-full lg:w-1/2 text-left">
            <div className="mb-8 md:mb-12">
              <span className="text-yellow-500 font-black uppercase tracking-[0.2em] text-[10px] md:text-xs">Game Routes</span>
              
              <div className="min-h-[180px] md:min-h-[220px] mt-4 md:mt-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight uppercase italic mb-4 md:mb-6">
                      {aboutData[index].title}
                    </h2>
                    <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                      {aboutData[index].description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <motion.button 
                whileTap={{ scale: 0.95 }}
                className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 dark:bg-yellow-500 text-white dark:text-black font-black uppercase tracking-widest rounded-xl md:rounded-2xl transition-all"
              >
                Learn More <ArrowRight size={20} />
              </motion.button>
            </div>

            {/* 📊 STATS BENTO GRID (Responsive 2-column) */}
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {stats.map((stat, i) => {
                const isActive = activeStat === i;
                return (
                  <motion.div 
                    key={i}
                    animate={{ 
                      scale: isActive ? 1.05 : 1,
                      borderColor: isActive ? 'rgba(250, 204, 21, 1)' : 'rgba(255, 255, 255, 0.1)',
                      boxShadow: isActive ? '0 10px 30px -10px rgba(250, 204, 21, 0.3)' : '0 0 0 rgba(0,0,0,0)'
                    }}
                    className={`p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border-2 bg-white dark:bg-white/5 transition-all relative overflow-hidden`}
                  >
                    {/* Background Light Flash Effect */}
                    {isActive && (
                      <motion.div 
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ duration: 0.8 }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent z-0"
                      />
                    )}

                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-4 transition-colors z-10 relative ${isActive ? 'bg-yellow-400 text-black' : 'bg-slate-100 dark:bg-slate-800 text-yellow-500'}`}>
                      {stat.icon}
                    </div>
                    
                    <div className="relative z-10">
                      <h4 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.value}</h4>
                      <p className={`text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-colors ${isActive ? 'text-yellow-600' : 'text-slate-400'}`}>
                        {stat.label}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;