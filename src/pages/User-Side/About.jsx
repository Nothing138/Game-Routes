import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Award, Globe, ShieldCheck, 
  Target, Heart, CheckCircle2, Milestone,
  ArrowUpRight, Fingerprint, Star
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const About = () => {
  const stats = [
    { label: "Successful Visas", value: "12K+", icon: <Award size={20} /> },
    { label: "Visa Success Rate", value: "98%", icon: <ShieldCheck size={20} /> },
    { label: "Global Partners", value: "500+", icon: <Globe size={20} /> },
    { label: "Years of Trust", value: "10+", icon: <Milestone size={20} /> },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white dark:bg-slate-950 pt-32 pb-0 overflow-hidden font-sans">
        
        {/* 🏛️ PREMIUM HERO SECTION */}
        <section className="max-w-[1440px] mx-auto px-6 lg:px-20 mb-32">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="lg:w-3/5 space-y-10"
            >
              <div className="inline-flex items-center gap-3 px-5 py-2 bg-slate-100 dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] dark:text-slate-400">Since 2015 • Trusted Agency</span>
              </div>

              <h1 className="text-6xl lg:text-8xl font-black text-slate-900 dark:text-white leading-[0.9] uppercase italic tracking-tighter">
                Redefining <br /> 
                <span className="text-blue-600 not-italic">Global</span> Mobility.
              </h1>

              <p className="text-xl text-slate-500 dark:text-slate-400 max-w-xl font-medium leading-relaxed">
                GameRoutes is not just a consultancy; we are your strategic partner in navigating the complexities of international career and travel.
              </p>

              <div className="flex flex-wrap gap-8">
                {["Elite Legal Support", "Global Network"].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                      <CheckCircle2 size={20} />
                    </div>
                    <span className="font-black uppercase italic tracking-tighter dark:text-white text-lg">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="lg:w-2/5 relative"
            >
              <div className="relative z-10 rounded-[4rem] overflow-hidden border-[15px] border-slate-50 dark:border-slate-900 shadow-2xl">
                <img src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80" alt="CEO" className="w-full h-[600px] object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                <div className="absolute bottom-10 left-10 right-10 p-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl">
                  <p className="text-blue-600 font-black uppercase italic tracking-widest text-xs mb-1">Our Philosophy</p>
                  <p className="text-slate-900 dark:text-white font-bold text-lg">"We don't move people, we move dreams."</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 📊 FLOATING STATS GRID */}
        <section className="px-6 lg:px-20 mb-40">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
            {stats.map((stat, i) => (
              <div key={i} className="p-12 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center group hover:bg-blue-600 transition-all duration-500">
                <div className="text-blue-600 group-hover:text-white mb-6 transition-colors">{stat.icon}</div>
                <h4 className="text-5xl font-black italic tracking-tighter dark:text-white group-hover:text-white mb-2">{stat.value}</h4>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 group-hover:text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 🎯 CORE VALUES (Glassmorphism Cards) */}
        <section className="bg-slate-900 py-32 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <div className="absolute top-1/4 left-10 w-96 h-96 bg-blue-500 rounded-full blur-[150px]" />
             <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-purple-500 rounded-full blur-[150px]" />
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-24 space-y-4">
              <h2 className="text-white text-5xl lg:text-7xl font-black uppercase italic tracking-tighter">Why Choose <span className="text-blue-500">Us?</span></h2>
              <div className="h-1 w-24 bg-blue-600 mx-auto" />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {[
                { title: "Integrity", icon: <Fingerprint size={32} />, desc: "Complete transparency in every document and every dollar spent." },
                { title: "Precision", icon: <Target size={32} />, desc: "Expert assessment to ensure near-perfect visa success rates." },
                { title: "Care", icon: <Heart size={32} />, desc: "Personalized support even after you land in your destination." }
              ].map((val, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -10 }}
                  className="p-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] hover:bg-white/10 transition-all group"
                >
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-xl">
                    {val.icon}
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase italic mb-4">{val.title}</h3>
                  <p className="text-slate-400 font-medium leading-relaxed group-hover:text-white/80 transition-colors">
                    {val.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ✉️ CTA SECTION */}
        <section className="py-40 max-w-7xl mx-auto px-6 text-center">
            <div className="space-y-10">
               <Star className="mx-auto text-blue-600" size={48} />
               <h2 className="text-6xl lg:text-8xl font-black uppercase italic tracking-tighter dark:text-white leading-none">
                 Ready to Write Your <br /> <span className="text-blue-600 underline decoration-wavy">Global Story?</span>
               </h2>
               <button className="inline-flex items-center gap-4 px-12 py-6 bg-slate-900 dark:bg-blue-600 text-white rounded-full font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">
                 Join Our Network <ArrowUpRight size={20} />
               </button>
            </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default About;