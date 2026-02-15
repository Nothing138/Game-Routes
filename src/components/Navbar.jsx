import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { navLinks, services } from '../constants';

import logoImg from '../assets/logo_game_routes.png'; 

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Scroll effect for premium Glass Morphism
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-[100] transition-all duration-500 ${
      scrolled ? 'bg-white/80 backdrop-blur-lg shadow-xl py-3' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/* 🚀 LOGO SECTION WITH CUSTOM IMAGE */}
        <Link to="/" className="flex items-center gap-3 group">
        <div className="relative w-12 h-12 flex items-center justify-center overflow-hidden rounded-xl bg-white shadow-md border border-slate-100 group-hover:scale-110 transition-transform duration-300">
            <img src={logoImg} alt="Logo" className="w-full h-full object-cover" />
        </div>
        
        <div className="flex flex-col">
            {/* Shimmer Text Logic */}
            <span className="text-2xl font-black tracking-tighter leading-none relative overflow-hidden">
            <span className="bg-gradient-to-r from-slate-900 via-blue-500 to-slate-900 bg-[length:200%_100%] bg-clip-text text-transparent animate-shimmer">
                GAME<span className="text-blue-600">ROUTES</span>
            </span>
            </span>
        </div>
        </Link>

        

        {/* DESKTOP MENU */}
        <div className="hidden lg:flex items-center gap-10">
          <ul className="flex gap-8 list-none">
            {navLinks.map((link) => (
              <li key={link.id}>
                <Link 
                  to={link.path} 
                  className={`text-sm font-bold uppercase tracking-widest transition-all ${
                    location.pathname === link.path ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'
                  }`}
                >
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>

          {/* SERVICES DROPDOWN */}
          <div className="relative group cursor-pointer">
            <button className="text-sm font-bold uppercase tracking-widest text-slate-600 flex items-center gap-1 group-hover:text-blue-600 transition-colors">
              Services <span className="text-[10px] group-hover:rotate-180 transition-transform duration-300">▼</span>
            </button>
            <div className="absolute top-full -left-10 mt-4 w-60 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-2xl p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-slate-50">
              {services.map((service) => (
                <Link 
                  key={service.title} 
                  to={service.path} 
                  className="flex items-center gap-4 px-4 py-3 hover:bg-blue-50 rounded-xl text-slate-700 text-sm font-semibold transition-all"
                >
                  <span className="text-xl">{service.icon}</span> {service.title}
                </Link>
              ))}
            </div>
          </div>

          <Link to="/login" className="px-7 py-3 bg-slate-900 text-white text-xs font-black uppercase tracking-[0.15em] rounded-xl hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-200 active:scale-95">
            Login
          </Link>
        </div>

        {/* MOBILE TOGGLE */}
        <button 
          onClick={() => setIsOpen(true)} 
          className="lg:hidden p-2 text-slate-900 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>

      

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[110]"
            />
            <motion.aside 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-[300px] bg-white z-[120] shadow-2xl p-10 flex flex-col"
            >
              <button onClick={() => setIsOpen(false)} className="self-end text-slate-400 hover:text-slate-900 transition-colors">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              <div className="mt-12 space-y-10">
                <div className="flex flex-col gap-5">
                  <p className="text-[11px] font-black text-blue-600 uppercase tracking-widest">Menu</p>
                  {navLinks.map((link) => (
                    <Link key={link.id} to={link.path} onClick={() => setIsOpen(false)} className="text-3xl font-bold text-slate-900">{link.title}</Link>
                  ))}
                </div>

                <div className="flex flex-col gap-4">
                  <p className="text-[11px] font-black text-blue-600 uppercase tracking-widest">Expertise</p>
                  {services.map((service) => (
                    <Link key={service.title} to={service.path} onClick={() => setIsOpen(false)} className="text-lg font-bold text-slate-500 hover:text-blue-600 transition-colors">{service.title}</Link>
                  ))}
                </div>

                <Link to="/login" onClick={() => setIsOpen(false)} className="mt-auto text-center py-4 bg-slate-900 text-white font-bold rounded-2xl">Client Portal</Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;