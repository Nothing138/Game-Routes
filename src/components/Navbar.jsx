import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, UserPlus, LogIn, X, ChevronDown, LogOut } from 'lucide-react';
import Swal from 'sweetalert2'; // Logout er jonno
import { navLinks, services } from '../constants';
import logoImg from '../assets/logo_game_routes.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  
  const location = useLocation();
  const navigate = useNavigate();

  // Login status check on mount and whenever localStorage changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [location]); // Path change holeo re-check korbe

  // Dark Mode Logic (Fixed)
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Logout Function
  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out from GAMEROUTES!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Logout'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        localStorage.removeItem('role'); // jodi thake
        setIsLoggedIn(false);
        navigate('/');
        Swal.fire('Logged Out!', 'Successfully logged out.', 'success');
      }
    });
  };

  return (
    <>
      <nav className={`fixed w-full z-[100] transition-all duration-500 ${
        scrolled ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg shadow-xl py-3' : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          
          {/* 🚀 LOGO SECTION */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center overflow-hidden rounded-xl bg-white shadow-md border border-slate-100 group-hover:scale-110 transition-transform duration-300">
              <img src={logoImg} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-black tracking-tighter leading-none text-slate-900 dark:text-white uppercase italic">
                <span className="text-blue-600">GAMEROUTES</span>
              </span>
            </div>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden lg:flex items-center gap-8">
            <ul className="flex gap-8 list-none">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <Link to={link.path} className={`text-[11px] font-black uppercase tracking-[0.15em] transition-all ${
                    location.pathname === link.path ? 'text-blue-600' : 'text-slate-600 dark:text-slate-300 hover:text-blue-600'
                  }`}>
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>

            {/* SERVICES DROPDOWN */}
            <div className="relative group cursor-pointer">
              <button className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-600 dark:text-slate-300 flex items-center gap-1 group-hover:text-blue-600 transition-colors">
                Services <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
              </button>
              <div className="absolute top-full -left-10 mt-4 w-64 bg-white dark:bg-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-2xl p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-slate-50 dark:border-slate-700">
                {services.map((service) => (
                  <Link key={service.title} to={service.path} className="flex items-center gap-4 px-4 py-3 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-xl text-slate-700 dark:text-slate-200 text-sm font-bold transition-all">
                    <span className="text-xl">{service.icon}</span> {service.title}
                  </Link>
                ))}
              </div>
            </div>

            {/* DARK MODE BUTTON */}
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-yellow-400 hover:scale-110 transition-all">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* CONDITIONAL BUTTON (Join Us or Logout) */}
            {!isLoggedIn ? (
              <button 
                onClick={() => setShowJoinModal(true)}
                className="px-7 py-3 bg-slate-900 dark:bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 dark:hover:bg-blue-700 transition-all shadow-lg active:scale-95"
              >
                Join Us
              </button>
            ) : (
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-red-700 transition-all shadow-lg active:scale-95"
              >
                <LogOut size={16} /> Logout
              </button>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <div className="lg:hidden flex items-center gap-4">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 text-slate-600 dark:text-yellow-400">
              {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
            </button>
            <button onClick={() => setIsOpen(true)} className="p-2 text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16m-7 6h7" /></svg>
            </button>
          </div>
        </div>
      </nav>

      {/* --- JOIN US MODAL --- */}
      <AnimatePresence>
        {showJoinModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowJoinModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden p-8 border border-white/20"
            >
              <button onClick={() => setShowJoinModal(false)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"><X size={20} className="dark:text-white"/></button>
              
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                   <UserPlus className="text-blue-600" size={32} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight">Ready to Start?</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium">Choose an option to access your portal</p>
              </div>

              <div className="space-y-4">
                <button onClick={() => {navigate('/login'); setShowJoinModal(false)}} className="w-full flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 rounded-2xl transition-all group">
                  <div className="flex items-center gap-4">
                    <LogIn size={24} className="text-blue-600 group-hover:text-white" />
                    <div className="text-left">
                      <p className="font-black text-sm uppercase tracking-wider">Login</p>
                      <p className="text-[10px] opacity-70 font-bold uppercase">Welcome back, Traveler</p>
                    </div>
                  </div>
                  <span className="text-xl opacity-0 group-hover:opacity-100 transition-all">→</span>
                </button>

                <button onClick={() => {navigate('/register'); setShowJoinModal(false)}} className="w-full flex items-center justify-between p-5 border-2 border-slate-100 dark:border-slate-800 hover:border-blue-600 rounded-2xl transition-all group">
                  <div className="flex items-center gap-4">
                    <UserPlus size={24} className="text-slate-400 group-hover:text-blue-600" />
                    <div className="text-left">
                      <p className="font-black text-sm uppercase tracking-wider dark:text-white group-hover:text-blue-600">Register</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Create a new account</p>
                    </div>
                  </div>
                  <span className="text-xl text-blue-600 opacity-0 group-hover:opacity-100 transition-all">→</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[110]" />
            <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed top-0 right-0 h-full w-[300px] bg-white dark:bg-slate-900 z-[120] p-10 flex flex-col shadow-2xl">
               <button onClick={() => setIsOpen(false)} className="self-end dark:text-white"><X size={30}/></button>
               <div className="mt-10 space-y-8">
                 <div className="flex flex-col gap-4">
                   <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Navigation</p>
                   {navLinks.map((link) => (
                     <Link key={link.id} to={link.path} onClick={() => setIsOpen(false)} className="text-2xl font-black text-slate-900 dark:text-white uppercase italic">{link.title}</Link>
                   ))}
                 </div>
                 
                 {/* Mobile View Check */}
                 {!isLoggedIn ? (
                    <button onClick={() => {setShowJoinModal(true); setIsOpen(false)}} className="w-full py-4 bg-blue-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-lg">Join Now</button>
                 ) : (
                    <button onClick={() => {handleLogout(); setIsOpen(false)}} className="w-full py-4 bg-red-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-lg">Logout</button>
                 )}
               </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;