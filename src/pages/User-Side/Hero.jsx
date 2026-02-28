import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowUpRight, Globe2, Sparkles, Phone, Mail, 
  MessageSquare, ChevronRight, Play, Users, Briefcase, GraduationCap 
} from 'lucide-react';

const Hero = () => {
  const [showSupport, setShowSupport] = useState(false);
  const [activeService, setActiveService] = useState(0); // For Highlight Loop

  // 📝 Service Data
  const services = [
    { label: 'Study', icon: <GraduationCap size={28} />, bg: 'bg-yellow-400', text: 'text-black' },
    { label: 'Work', icon: <Briefcase size={28} />, bg: 'bg-slate-900', text: 'text-white' },
    { label: 'Invest', icon: <Globe2 size={28} />, bg: 'bg-slate-100 dark:bg-slate-800', text: 'dark:text-white' },
    { label: 'Migrate', icon: <Sparkles size={28} />, bg: 'bg-blue-600', text: 'text-white' }
  ];

  // 🔄 Highlight Loop Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveService((prev) => (prev + 1) % services.length);
    }, 2000); // 2 second por por highlight change hobe
    return () => clearInterval(interval);
  }, []);

  const supportLinks = [
    { icon: <MessageSquare size={20} />, label: 'WhatsApp', color: 'bg-green-500', link: 'https://wa.me/48728356666' },
    { icon: <Mail size={20} />, label: 'Email Us', color: 'bg-blue-500', link: 'mailto:office@atozserwisplus.pl' },
    { icon: <Phone size={20} />, label: 'Direct Call', color: 'bg-yellow-500', link: 'tel:+48222085497' },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#fafafa] dark:bg-[#050505] pt-24 pb-12">
      
      {/* 🎨 Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-yellow-400/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* 📝 LEFT CONTENT */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-yellow-400/10 border border-yellow-400/20 mb-6"
            >
              <span className="flex h-2 w-2 rounded-full bg-yellow-500 animate-ping" />
              <span className="text-[10px] font-black text-yellow-600 dark:text-yellow-500 uppercase tracking-[0.2em]">Trusted Global Partner</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.95] mb-8">
              GLOBAL <br /> 
              <span className="text-yellow-500 italic uppercase">Solutions</span> <br />
              AT YOUR FINGERTIPS
            </h1>

            <p className="max-w-xl text-slate-600 dark:text-slate-400 text-lg md:text-xl font-medium mb-10 leading-relaxed">
              Premium A-to-Z services for <span className="text-slate-900 dark:text-white font-bold">Study, Work, and Migration</span>. We bridge the gap between your dreams and global opportunities.
            </p>

            <div className="flex flex-wrap items-center gap-5">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                className="px-10 py-5 bg-slate-900 dark:bg-yellow-500 text-white dark:text-black font-black uppercase tracking-widest rounded-2xl flex items-center gap-3 shadow-2xl transition-all"
              >
                Get Started <ArrowUpRight size={20} />
              </motion.button>

              <button className="flex items-center gap-4 group">
                <div className="w-14 h-14 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center group-hover:bg-yellow-400 transition-all">
                  <Play size={20} className="fill-current group-hover:text-black" />
                </div>
                <span className="font-bold uppercase tracking-widest text-xs">Our Story</span>
              </button>
            </div>
          </motion.div>

          {/* 🖼️ RIGHT CONTENT (Animated Bento Box) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-slate-100 dark:border-white/5">
               <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8 uppercase italic tracking-tight">Our Core Services</h3>
               
               <div className="grid grid-cols-2 gap-4">
                  {services.map((service, i) => {
                    const isActive = activeService === i;
                    return (
                      <motion.div 
                        key={i}
                        animate={{ 
                          scale: isActive ? 1.05 : 1,
                          y: isActive ? -10 : 0,
                          boxShadow: isActive ? '0 20px 40px -10px rgba(250, 204, 21, 0.4)' : '0 0 0 rgba(0,0,0,0)'
                        }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className={`${service.bg} ${service.text} p-6 rounded-[2rem] cursor-pointer relative overflow-hidden group`}
                      >
                        {/* ⚡ Glow Effect for Active Card */}
                        {isActive && (
                          <motion.div 
                            layoutId="highlight"
                            className="absolute inset-0 border-4 border-yellow-400 rounded-[2rem] z-20"
                          />
                        )}
                        
                        <div className="mb-4 relative z-10">{service.icon}</div>
                        <div className="flex justify-between items-center relative z-10">
                          <span className="font-black uppercase text-sm tracking-wider">{service.label}</span>
                          <ChevronRight size={16} className={`${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'} transition-all`} />
                        </div>
                      </motion.div>
                    );
                  })}
               </div>

               {/* Stats Overlay */}
               <div className="mt-8 pt-8 border-t border-slate-100 dark:border-white/5 flex justify-between items-center">
                  <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 overflow-hidden">
                        <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
                      </div>
                    ))}
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-slate-900 dark:text-white leading-none">12.5k+</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Success Stories</p>
                  </div>
               </div>
            </div>

            {/* Floating Quick Support Button */}
            <div className="absolute -bottom-6 -left-6 md:-left-12">
              <div className="relative z-30">
                <AnimatePresence>
                  {showSupport && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.9 }}
                      className="absolute bottom-20 left-0 flex flex-col gap-3"
                    >
                      {supportLinks.map((s, i) => (
                        <motion.a 
                          key={i}
                          href={s.link}
                          target="_blank"
                          rel="noreferrer"
                          className={`${s.color} text-white p-4 rounded-2xl shadow-xl flex items-center gap-3 hover:scale-110 transition-transform`}
                        >
                          {s.icon}
                          <span className="text-xs font-black uppercase tracking-widest pr-2">{s.label}</span>
                        </motion.a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <motion.button 
                  onClick={() => setShowSupport(!showSupport)}
                  whileHover={{ scale: 1.05 }}
                  className="bg-yellow-400 text-black p-6 rounded-[2rem] shadow-2xl flex items-center gap-4 group"
                >
                  <Phone className={`${showSupport ? 'rotate-90' : 'animate-bounce'} transition-transform`} />
                  <div className="text-left">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] leading-none opacity-60">Need Help?</p>
                    <p className="text-sm font-black uppercase tracking-tight">Get Counselling</p>
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;