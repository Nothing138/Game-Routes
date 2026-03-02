import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { 
  Sun, Moon, Globe, Phone, Clock, Menu, X, 
  Home, Briefcase, GraduationCap, PlaneTakeoff, 
  Handshake, LogIn, UserPlus, ArrowRight, Facebook, Instagram, Twitter, ChevronDown,
  User, LogOut, Settings
} from 'lucide-react';
import logoImg from '../assets/logo_game_routes.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false); 
  const [currentLang, setCurrentLang] = useState({ name: 'English', flag: '🇺🇸' });
  
  // 🔐 Auth State
  const [user, setUser] = useState(null);

  const [isDarkMode, setIsDarkMode] = useState(() => 
    localStorage.getItem('theme') === 'dark' || 
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );
  
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const langRef = useRef(null);

  // 🌐 LANGUAGES LIST
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'zh-CN', name: '中文', flag: '🇨🇳' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ms', name: 'Melayu', flag: '🇲🇾' },
    { code: 'ur', name: 'اردو', flag: '🇵🇰' },
    { code: 'ne', name: 'नेपाली', flag: '🇳🇵' },
    { code: 'af', name: 'Afrikaans', flag: '🇿🇦' }
  ];

  // 🔄 Language Switch Logic
  const handleTranslate = (lang) => {
    const selectEl = document.querySelector('.goog-te-combo');
    if (selectEl) {
      selectEl.value = lang.code;
      selectEl.dispatchEvent(new Event('change'));
      setCurrentLang({ name: lang.name, flag: lang.flag });
      setShowLangDropdown(false);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `Switching to ${lang.name}`,
        showConfirmButton: false,
        timer: 1000
      });
    } else {
      console.error("Google Translate script not loaded yet.");
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'info',
        title: 'Translation engine is loading...',
        showConfirmButton: false,
        timer: 1500
      });
    }
  };

  // 🔄 REAL-TIME AUTH CHECK LOGIC
  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser && storedUser !== "undefined") {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkUser(); // Initial check

    // Listen for custom login event and storage changes
    window.addEventListener('authChange', checkUser);
    window.addEventListener('storage', checkUser);

    return () => {
      window.removeEventListener('authChange', checkUser);
      window.removeEventListener('storage', checkUser);
    };
  }, []);

  // 🚪 Logout Function
  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out of your session!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, Logout!',
      background: isDarkMode ? '#0f172a' : '#fff',
      color: isDarkMode ? '#fff' : '#000',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        setShowUserDropdown(false);
        
        // Notify other components
        window.dispatchEvent(new Event('authChange'));
        
        navigate('/');
        
        Swal.fire({
          title: 'Logged Out!',
          text: 'Successfully logged out.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          background: isDarkMode ? '#0f172a' : '#fff',
          color: isDarkMode ? '#fff' : '#000',
        });
      }
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
      if (langRef.current && !langRef.current.contains(event.target)) {
        setShowLangDropdown(false);
      } 
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getActiveIcon = (path) => {
    const icons = {
      '/': <Home size={18} />,
      '/visa': <PlaneTakeoff size={18} />,
      '/job': <Briefcase size={18} />,
      '/travel': <Globe size={18} />,
      '/aboutus': <Phone size={18} />,
    };
    return icons[path] || <Home size={18} />;
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Visa', path: '/visa' },
    { name: 'Job', path: '/job' },
    { name: 'Travel', path: '/travel' },
    { name: 'About Us', path: '/aboutus' },
  ];

  return (
    <header className="fixed w-full z-[100] font-sans">
      {/* 1. TOP UTILITY BAR */}
      <div className={`hidden lg:block transition-all duration-500 bg-slate-900 text-white/80 ${scrolled ? 'h-0 opacity-0 overflow-hidden' : 'h-10 opacity-100'}`}>
        <div className="max-w-[1440px] mx-auto px-8 h-full flex justify-between items-center text-[11px] font-medium tracking-widest">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 border-r border-white/10 pr-6 uppercase">
              <Clock size={12} className="text-yellow-400" /> Mon - Sat: 9am - 6pm
            </div>
            <div className="flex items-center gap-4">
              <Facebook size={14} className="hover:text-blue-400 cursor-pointer transition-colors" />
              <Instagram size={14} className="hover:text-pink-400 cursor-pointer transition-colors" />
              <Twitter size={14} className="hover:text-sky-400 cursor-pointer transition-colors" />
            </div>
          </div>
          <div className="flex items-center gap-8 uppercase">
            <a href="tel:+48222085497" className="hover:text-white transition-colors flex items-center gap-2">
              <Phone size={12} className="text-yellow-400" /> +48 22 208 5497
            </a>
            {/* 🌐 GLOBAL LANGUAGE SWITCHER IN UTILITY BAR */}
            <div className="relative" ref={langRef}>
              <div 
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className="flex items-center gap-2 cursor-pointer group hover:text-white transition-all py-1"
              >
                <Globe size={12} className="text-yellow-400 group-hover:rotate-180 transition-transform duration-700" />
                <span className="font-bold tracking-widest">{currentLang.flag} {currentLang.name}</span>
                <ChevronDown size={10} className={`transition-transform ${showLangDropdown ? 'rotate-180' : ''}`} />
              </div>

              <AnimatePresence>
                {showLangDropdown && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 p-2 z-[110] grid grid-cols-2 gap-1"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleTranslate(lang)}
                        className="flex items-center gap-2 px-3 py-2 text-[9px] font-black text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all uppercase"
                      >
                        <span>{lang.flag}</span>
                        <span className="truncate">{lang.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION */}
      <nav className={`transition-all duration-500 border-b ${
        scrolled 
        ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl py-3 shadow-lg border-transparent' 
        : 'bg-white dark:bg-slate-900 py-5 border-slate-100 dark:border-slate-800'
      }`}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-8 flex justify-between items-center">
          
          <Link to="/" className="flex items-center gap-4 group">
            <img src={logoImg} alt="Logo" className="h-10 lg:h-12 w-auto transition-transform duration-700 group-hover:scale-110" />
            <div className="hidden sm:flex flex-col">
              <span className="text-xl lg:text-2xl font-black tracking-tighter text-slate-900 dark:text-white uppercase leading-none">
                GAME<span className="text-blue-600">ROUTES</span>
              </span>
              <span className="text-[10px] font-bold text-blue-600 dark:text-yellow-500 uppercase tracking-[0.3em] mt-1">Official Portal</span>
            </div>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden lg:flex items-center gap-2">
            <ul className="flex items-center bg-slate-100/50 dark:bg-slate-800/50 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.name}>
                    <Link to={item.path} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-wider transition-all relative ${
                      isActive ? 'text-slate-900' : 'text-slate-500 dark:text-slate-400 hover:text-blue-600'
                    }`}>
                      {isActive && (
                        <motion.span layoutId="premiumActive" className="absolute inset-0 bg-yellow-400 shadow-md rounded-xl z-[-1]" transition={{ type: 'spring', duration: 0.5 }} />
                      )}
                      {isActive && getActiveIcon(item.path)}
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
            
            <div className="flex items-center gap-3 ml-4">
               <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-yellow-400 border border-slate-200 dark:border-slate-700 transition-all">
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* 👤 CONDITIONAL RENDER: USER ICON OR JOIN US */}
              {user ? (
                <div className="relative" ref={dropdownRef}>
                   <button 
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-3 p-1.5 pr-4 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all"
                   >
                     <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
                        {user.name ? user.name.charAt(0).toUpperCase() : <User size={18}/>}
                     </div>
                     <div className="text-left">
                        <p className="text-[10px] font-black uppercase dark:text-white leading-tight truncate max-w-[80px]">{user.name || 'User'}</p>
                        <p className="text-[8px] font-bold text-blue-600 uppercase tracking-widest">Active</p>
                     </div>
                     <ChevronDown size={14} className={`dark:text-white transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} />
                   </button>

                   <AnimatePresence>
                    {showUserDropdown && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-3 z-[110]"
                      >
                        <div className="p-4 border-b border-slate-50 dark:border-slate-800 mb-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account Details</p>
                            <p className="text-xs font-black dark:text-white truncate">{user.email}</p>
                        </div>
                        <button onClick={() => {navigate('/profile'); setShowUserDropdown(false)}} className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all group">
                          <User size={16} className="text-slate-400 group-hover:text-blue-600" />
                          <span className="text-xs font-bold uppercase tracking-wider dark:text-white">Profile</span>
                        </button>
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-xl transition-all group mt-2">
                          <LogOut size={16} className="text-red-500" />
                          <span className="text-xs font-black uppercase tracking-wider text-red-600">Logout</span>
                        </button>
                      </motion.div>
                    )}
                   </AnimatePresence>
                </div>
              ) : (
                <button 
                  onClick={() => setShowJoinModal(true)} 
                  className="px-8 py-3 bg-slate-900 dark:bg-blue-600 text-white text-[12px] font-black uppercase tracking-[0.2em] rounded-xl hover:shadow-xl transition-all active:scale-95"
                >
                  Join Us
                </button>
              )}
            </div>
          </div>

          {/* MOBILE TOGGLE */}
          <div className="lg:hidden flex items-center gap-3">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2.5 text-slate-600 dark:text-yellow-400">
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setIsOpen(true)} className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-900 dark:text-white">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE FULL-SCREEN MENU */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[140]" />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-[150] w-full max-w-sm bg-white dark:bg-slate-950 flex flex-col p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-12">
                 <img src={logoImg} alt="Logo" className="h-10" />
                 <button onClick={() => setIsOpen(false)} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl dark:text-white"><X size={28}/></button>
              </div>
              <div className="space-y-6 flex-grow overflow-y-auto">
                {navItems.map((item, idx) => (
                  <motion.div key={item.name} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}>
                    <Link to={item.path} onClick={() => setIsOpen(false)} className="group text-3xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white flex items-center gap-4">
                      <span className="text-blue-600 text-xs not-italic font-bold tracking-widest">0{idx+1}</span> 
                      <span className="group-hover:pl-4 transition-all duration-300 group-hover:text-blue-600">{item.name}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-auto pt-10 border-t border-slate-100 dark:border-slate-800 space-y-4">
                 {user ? (
                   <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black dark:text-white uppercase italic">{user.name}</p>
                          <p className="text-[10px] text-slate-500 uppercase font-bold">{user.email}</p>
                        </div>
                      </div>
                      <button onClick={handleLogout} className="w-full py-5 bg-red-600 text-white font-black uppercase tracking-widest rounded-2xl text-xl shadow-lg">Logout</button>
                   </div>
                 ) : (
                   <button onClick={() => {setShowJoinModal(true); setIsOpen(false)}} className="w-full py-5 bg-blue-600 text-white font-black uppercase tracking-widest rounded-2xl text-xl shadow-lg">Get Started</button>
                 )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* JOIN US MODAL */}
      <AnimatePresence>
        {showJoinModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowJoinModal(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border border-white/10">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-blue-500 to-indigo-600" />
              <div className="p-10 lg:p-14">
                <div className="flex justify-end absolute top-8 right-8">
                  <button onClick={() => setShowJoinModal(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <X size={24} className="dark:text-white" />
                  </button>
                </div>
                <div className="text-center mb-10">
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase italic">Start Your Journey</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium mt-2 uppercase tracking-widest text-[10px]">Join GameRoutes Global Solutions</p>
                </div>
                <div className="grid gap-5">
                  <button onClick={() => {navigate('/login'); setShowJoinModal(false)}} className="group flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-900 dark:hover:bg-blue-600 rounded-[2rem] transition-all duration-300">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-white dark:bg-slate-700 rounded-2xl flex items-center justify-center group-hover:rotate-[15deg] transition-transform">
                        <LogIn className="text-blue-600 group-hover:text-blue-400" size={28} />
                      </div>
                      <div className="text-left">
                        <h4 className="font-black text-lg uppercase tracking-tight group-hover:text-white transition-colors">Sign In</h4>
                        <p className="text-[10px] font-bold uppercase text-slate-400 group-hover:text-white/60">Access your portal</p>
                      </div>
                    </div>
                    <ArrowRight className="text-slate-300 group-hover:text-white transition-all group-hover:translate-x-2" />
                  </button>
                  <button onClick={() => {navigate('/register'); setShowJoinModal(false)}} className="group flex items-center justify-between p-6 border-2 border-slate-100 dark:border-slate-800 hover:border-yellow-400 rounded-[2rem] transition-all duration-300">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center group-hover:bg-yellow-400 transition-colors">
                        <UserPlus className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900" size={28} />
                      </div>
                      <div className="text-left">
                        <h4 className="font-black text-lg uppercase tracking-tight dark:text-white group-hover:text-yellow-400 transition-colors">Create Account</h4>
                        <p className="text-[10px] font-bold uppercase text-slate-400">Join our network</p>
                      </div>
                    </div>
                    <ArrowRight className="text-slate-300 group-hover:text-yellow-400 transition-all group-hover:translate-x-2" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;