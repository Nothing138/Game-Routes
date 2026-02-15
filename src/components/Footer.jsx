import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Linkedin, Instagram, Mail, ArrowRight, MapPin, Phone, Globe, ShieldCheck } from 'lucide-react';

// Custom Image Import
import logoImg from '../assets/logo_game_routes.png'; 

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#020617] text-slate-400 relative border-t border-slate-900 mt-20">
      {/* 🌌 Ambient Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/10 blur-[150px] rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-600/10 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* 📧 1. Newsletter Section (No Overlap Version) */}
        <div className="py-12 md:py-16 border-b border-slate-800/50">
          <div className="bg-gradient-to-br from-slate-900 to-black border border-slate-800 p-8 md:p-12 rounded-[2.5rem] shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="max-w-md text-center lg:text-left">
              <h3 className="text-3xl font-black text-white mb-3 tracking-tight">Stay Connected</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                Receive the latest job alerts and visa policy updates directly to your inbox.
              </p>
            </div>
            <form className="w-full lg:w-auto flex flex-col sm:flex-row gap-3 bg-slate-800/30 p-2 rounded-2xl border border-slate-700/50 backdrop-blur-md">
              <input 
                type="email" 
                placeholder="professional-email@company.com" 
                className="bg-transparent border-none outline-none px-5 py-3 text-white placeholder:text-slate-500 w-full lg:w-72 text-sm focus:ring-0"
                required
              />
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 group">
                Join Now <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>

        {/* 🏢 2. Main Footer Grid */}
        <div className="py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-8">
          
          {/* Brand Identity */}
          <div className="lg:col-span-4 space-y-8 text-center sm:text-left">
            <Link to="/" className="flex items-center justify-center sm:justify-start gap-3 group">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center p-2 shadow-2xl transition-transform group-hover:-rotate-6">
                <img src={logoImg} alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-2xl font-black text-white tracking-tighter leading-none">
                  GAME<span className="text-blue-500 italic">ROUTES</span>
                </span>
                <span className="text-[10px] font-bold text-slate-500 tracking-[0.3em] uppercase mt-1">International Agency</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm mx-auto sm:mx-0">
              Transforming the future of global mobility. We simplify the complexities of international recruitment and visa processing.
            </p>
            <div className="flex justify-center sm:justify-start gap-3">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, idx) => (
                <a key={idx} href="#" className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center hover:border-blue-500/50 hover:text-blue-500 transition-all shadow-lg hover:-translate-y-1">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-2 text-center sm:text-left">
            <h4 className="text-white text-[11px] font-black uppercase tracking-[0.4em] mb-8 opacity-50">Explore</h4>
            <ul className="space-y-4">
              {['Home', 'About Us', 'Find Jobs', 'Visa'].map(item => (
                <li key={item}>
                  <Link to="/" className="text-sm font-bold hover:text-blue-500 transition-colors flex items-center justify-center sm:justify-start gap-2 group">
                    <span className="w-0 h-[1px] bg-blue-500 group-hover:w-3 transition-all" /> {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Expertise Links */}
          <div className="lg:col-span-2 text-center sm:text-left">
            <h4 className="text-white text-[11px] font-black uppercase tracking-[0.4em] mb-8 opacity-50">Expertise</h4>
            <ul className="space-y-4">
              {['Recruitment', 'Consultancy', 'Ticketing', 'Legal Support'].map(item => (
                <li key={item}>
                  <Link to="/" className="text-sm font-bold hover:text-blue-500 transition-colors flex items-center justify-center sm:justify-start gap-2 group">
                    <span className="w-0 h-[1px] bg-blue-500 group-hover:w-3 transition-all" /> {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 📞 3. Contact Info with Premium Call Hover */}
          <div className="lg:col-span-4 space-y-8 text-center sm:text-left">
            <h4 className="text-white text-[11px] font-black uppercase tracking-[0.4em] mb-8 opacity-50">Contact Us</h4>
            <div className="space-y-4">
              
              {/* Address */}
              <div className="flex items-start justify-center sm:justify-start gap-4 p-5 rounded-3xl bg-slate-900/40 border border-slate-800/40">
                <MapPin size={20} className="text-blue-500 shrink-0 mt-1" />
                <p className="text-xs font-semibold leading-relaxed">
                  JM-IT Center, Floor 18, <br /> Gulshan-2, Dhaka 1212, Bangladesh.
                </p>
              </div>

              {/* Interactive Phone Link */}
              <a 
                href="tel:+8801900000000" 
                className="group flex items-center justify-center sm:justify-start gap-4 p-5 rounded-3xl bg-slate-900/40 border border-slate-800/40 hover:bg-slate-800/60 hover:border-blue-500/30 transition-all duration-300 shadow-sm"
              >
                <div className="p-2.5 rounded-xl bg-blue-500/10 group-hover:bg-blue-500 transition-all duration-300">
                  <Phone 
                    size={20} 
                    className="text-blue-500 group-hover:text-white transition-colors duration-300" 
                  />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-blue-400 transition-colors">Emergency Support</span>
                  <p className="text-xs font-black tracking-widest text-slate-300 group-hover:text-white transition-colors">+880 1900 000 000</p>
                </div>
              </a>

            </div>
          </div>
        </div>

        {/* 🔒 4. Bottom Footer Bar */}
        <div className="py-10 border-t border-slate-900/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap justify-center items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-500">
             <div className="flex items-center gap-2">
               <ShieldCheck size={14} className="text-emerald-500" /> Secure SSL Encrypted
             </div>
             <span>© {currentYear} GAME ROUTES</span>
          </div>
          
          <div className="flex items-center gap-4">
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Product of</span>
             <div className="px-4 py-1.5 bg-blue-600/10 border border-blue-500/20 rounded-full flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">JM-IT Enterprise</span>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;