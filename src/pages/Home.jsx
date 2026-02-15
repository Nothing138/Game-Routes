import React from 'react';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="overflow-hidden">
      {/* 1. Hero Section with Animation */}
      <section className="max-w-7xl mx-auto px-4 pt-20 pb-16 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-tight"
        >
          Explore Your Global <br />
          <span className="text-blue-600">Career Routes</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto"
        >
          JM-IT agency-r madhyome ekhon bideshe chakri, visa ebong travel hobe ekdom easy.
        </motion.p>
      </section>

      {/* About Section */}
        <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
            <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
            >
            <div className="w-full h-[400px] bg-blue-100 rounded-[2rem] shadow-inner overflow-hidden">
                {/* Placeholder for About Image */}
                <div className="absolute inset-0 flex items-center justify-center text-blue-300 font-bold text-6xl">JM-IT</div>
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-2xl border border-slate-50">
                <p className="text-4xl font-bold text-blue-600">10+</p>
                <p className="text-slate-500 text-sm font-medium">Years of Trust</p>
            </div>
            </motion.div>

            <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            >
            <h4 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4">About Game Routes</h4>
            <h2 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">We Bridge The Gap Between You and Your Dreams.</h2>
            <p className="text-slate-600 text-lg mb-8">JM-IT Agency-r pokkho theke amra apnader global recruitment process-ke shohoj korte kaj korchi. Amader platform-e chakri khoja theke suru kore visa processing ar travel booking—shob ekhon ekebare apnar hater muthoy.</p>
            <button className="border-2 border-slate-900 text-slate-900 px-8 py-3 rounded-xl font-bold hover:bg-slate-900 hover:text-white transition-all">Learn More</button>
            </motion.div>
        </div>
        </section>
      {/* 3. Blog Preview (Details Section) */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Latest Updates & Blogs</h2>
            <p className="text-slate-500">Admin korthrik prokashito shokol news ekhane paben</p>
          </div>
          <button className="text-blue-600 font-semibold hover:underline">View All</button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <motion.div 
            whileHover={{ y: -12 }}
            className="group bg-white rounded-3xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-50 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500"
            >
            <div className="h-60 rounded-2xl bg-slate-100 mb-6 overflow-hidden relative">
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-blue-600 uppercase">Visa Update</div>
            </div>
            <h4 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">UK Work Visa Rules Changed for 2026</h4>
            <p className="text-slate-500 mt-3 text-sm line-clamp-2 leading-relaxed">Admin update: Naya rules onusare ekhon visa processing speed 40% bere gache...</p>
            <div className="mt-6 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Feb 15, 2026</span>
                <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">→</button>
            </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;