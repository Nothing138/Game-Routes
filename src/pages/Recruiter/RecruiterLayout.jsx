import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import axios from 'axios'; // Backend connectivity-r jonno
import { 
  LayoutDashboard, Briefcase, Users, UserCircle, 
  ChevronDown, ChevronRight, Settings, PlusCircle, 
  Search, Bell, LogOut, MessageSquare, ShieldCheck,
  Zap, Sun, Moon
} from 'lucide-react';

const RecruiterLayout = () => {
  const [openMenus, setOpenMenus] = useState({ jobs: true, talent: true, messages: true });
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const [recruiterInfo, setRecruiterInfo] = useState(null); // Real data state
  const [unreadCounts, setUnreadCounts] = useState({ admin: 0, candidate: 0 }); // Message counts
  const location = useLocation();

  // --- DARK MODE LOGIC ---
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // --- 🌐 BACKEND FETCHING LOGIC ---
  useEffect(() => {
    const getRecruiterData = async () => {
      try {
        const token = localStorage.getItem('token'); // Login token
        // API theke recruiter details anbo
        const res = await axios.get('http://localhost:5000/api/recruiter/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRecruiterInfo(res.data);

        // Unread message count anar jonno alada API call
        const msgCount = await axios.get('http://localhost:5000/api/recruiter/message-stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUnreadCounts(msgCount.data); // { admin: 1, candidate: 5 } format-e data ashbe
      } catch (err) {
        console.error("Connectivity problem or not logged in", err);
      }
    };
    getRecruiterData();
  }, []);

  // --- 🔔 Notifications State 
  const [notifications, setNotifications] = useState([]); 
  const [showNotifications, setShowNotifications] = useState(false)

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data);
    } catch (err) {
      console.error("Notification fetch failed", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); 
    return () => clearInterval(interval);
  }, []);

  // --- Bell Click Logic ---
  const handleNotificationClick = async () => {
    setShowNotifications(!showNotifications);
    
    // Dropdown open korle shob gulo "Read" mark korbe database-e
    if (!showNotifications && notifications.some(n => !n.is_read)) {
      try {
        const token = localStorage.getItem('token');
        await axios.put('http://localhost:5000/api/notifications/read-all', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotifications(prev => prev.map(n => ({...n, is_read: 1})));
      } catch (err) {
        console.error("Update error", err);
      }
    }
  };

  const unreadNotifyCount = notifications.filter(n => !n.is_read).length;

  const toggleMenu = (menu) => {
    setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  return (
    <div className={`flex min-h-screen font-sans transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-slate-200' : 'bg-[#F8FAFC] text-slate-700'}`}>
      
      {/* 🌲 SIDEBAR */}
      <aside className={`w-72 border-r flex flex-col fixed h-full z-50 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
        
        {/* Branding - DYNAMIC VERSION */}
        <div className="p-6 pb-2">
          <div className={`flex items-center gap-3 p-3 rounded-2xl border transition-colors ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-indigo-50/50 border-indigo-100/50'} mb-2`}>
            <div className="w-10 h-10 bg-indigo-600 rounded-xl shadow-lg flex items-center justify-center text-white font-bold overflow-hidden">
               {recruiterInfo?.company_logo ? (
                 <img src={recruiterInfo.company_logo} alt="Logo" className="w-full h-full object-cover" />
               ) : (
                 recruiterInfo?.company_name?.charAt(0) || "R"
               )}
            </div>
            <div className="overflow-hidden">
              <h1 className={`text-xs font-black truncate uppercase ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                {recruiterInfo?.company_name || "Loading..."}
              </h1>
              <p className="text-[9px] font-bold text-indigo-500 uppercase tracking-tighter italic">
                {recruiterInfo?.recruiter_status === 'approved' ? "Verified Agency" : "Identity Pending"}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto pt-4 text-slate-400">
          <MenuLink to="/recruiter/dashboard" icon={<LayoutDashboard size={18}/>} label="Overview" active={location.pathname === '/recruiter/dashboard'} isDark={isDarkMode} />

          {/* Hiring Desk */}
          <TreeGroup label="Hiring Desk" icon={<Briefcase size={18}/>} isOpen={openMenus.jobs} onClick={() => toggleMenu('jobs')} isDark={isDarkMode}>
            <SubMenuLink to="/recruiter/post-job" label="Post a Job" isDark={isDarkMode} />
            <SubMenuLink to="/recruiter/my-jobs" label="Active Listings" isDark={isDarkMode} />
            <Link to="/recruiter/applications" className="flex items-center justify-between p-2 pl-4 text-[11px] font-bold transition-all italic hover:text-indigo-500">
                <span>New Applications</span>
                <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
            </Link>
          </TreeGroup>

          {/* 💬 Messaging Hub - BACKEND CONNECTED BLINKING LOGIC */}
          <TreeGroup label="Messaging Hub" icon={<MessageSquare size={18}/>} isOpen={openMenus.messages} onClick={() => toggleMenu('messages')} isDark={isDarkMode}>
            <Link to="/recruiter/messages/admin" className="flex items-center justify-between p-2 pl-4 text-[11px] font-bold text-slate-400 hover:text-indigo-500 transition-all italic">
                <div className="flex items-center gap-2">
                    <ShieldCheck size={12} className="text-red-500"/>
                    <span>Game Routes Support</span>
                </div>
                {unreadCounts.admin > 0 && <span className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></span>}
            </Link>
            <Link to="/recruiter/messages/users" className="flex items-center justify-between p-2 pl-4 text-[11px] font-bold text-slate-400 hover:text-indigo-500 transition-all italic">
                <div className="flex items-center gap-2">
                    <Users size={12} className="text-indigo-500"/>
                    <span>Talent Inbox</span>
                </div>
                {unreadCounts.candidate > 0 && <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>}
            </Link>
          </TreeGroup>

          <MenuLink to="/recruiter/staff" icon={<Zap size={18}/>} label="Staff Manager" active={location.pathname.includes('staff')} isDark={isDarkMode} />
          <MenuLink to="/recruiter/profile" icon={<UserCircle size={18}/>} label="Company Profile" active={location.pathname.includes('profile')} isDark={isDarkMode} />
        </nav>

        {/* LOGOUT WITH CLEARING TOKEN */}
        <div className={`p-4 mt-auto border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-50'}`}>
          <button 
            onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
            className="w-full flex items-center justify-center gap-2 p-3 bg-slate-900 text-white rounded-xl font-bold uppercase text-[10px] hover:bg-red-600 transition-all shadow-lg"
          >
            <LogOut size={16} /> Logout Account
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-72">
        <header className={`h-20 backdrop-blur-xl border-b sticky top-0 z-40 px-10 flex justify-between items-center transition-colors duration-300 ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-100'}`}>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
            <h2 className={`font-bold text-sm tracking-tight uppercase italic ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Recruiter Command Center</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2.5 rounded-xl transition-all border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-yellow-400 shadow-indigo-900/20' : 'bg-slate-50 border-slate-200 text-slate-400 shadow-sm hover:text-indigo-600'}`}
            >
              {isDarkMode ? <Sun size={20} fill="currentColor" /> : <Moon size={20} />}
            </button>

            <div className="relative">
              <button 
                onClick={handleNotificationClick}
                className={`p-2.5 rounded-xl transition-all ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-50 text-slate-400'}`}
              >
                <Bell size={20} />
                {unreadNotifyCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
                )}
              </button>

              {showNotifications && (
                <div className={`absolute right-0 mt-3 w-80 rounded-2xl shadow-2xl border z-50 overflow-hidden ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                  <div className="p-4 border-b dark:border-slate-800 font-bold text-xs uppercase">Notifications</div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map(n => (
                        <div key={n.id} className="p-4 border-b dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800">
                          <p className="text-xs">{n.message}</p>
                          <span className="text-[10px] text-slate-400">{new Date(n.created_at).toLocaleTimeString()}</span>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-xs text-slate-400">No new alerts</div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <Link to="/recruiter/post-job" className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-[11px] flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-indigo-600/20 uppercase tracking-wider">
              <PlusCircle size={16} /> Quick Post
            </Link>
          </div>
        </header>

        <div className="p-8">
          {/* Passing recruiter data and theme to children */}
          <Outlet context={{ isDarkMode, recruiterInfo }} />
        </div>
      </main>
    </div>
  );
};

// --- Helper Components for Sidebar ---
const MenuLink = ({ to, icon, label, active, isDark }) => (
  <Link to={to} className={`flex items-center gap-3 p-3 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all ${
    active 
      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
      : isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-50 text-slate-500'
  }`}>
    {icon} <span>{label}</span>
  </Link>
);

const TreeGroup = ({ label, icon, children, isOpen, onClick, isDark }) => (
  <div className="space-y-1">
    <button onClick={onClick} className={`w-full flex items-center justify-between p-3 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all ${
      isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-50 text-slate-500'
    }`}>
      <div className="flex items-center gap-3">{icon} <span>{label}</span></div>
      {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
    </button>
    {isOpen && <div className="ml-4 pl-4 border-l border-slate-800/50 space-y-1">{children}</div>}
  </div>
);

const SubMenuLink = ({ to, label, isDark }) => (
  <Link to={to} className={`block p-2 pl-4 text-[10px] font-bold uppercase tracking-tight transition-all italic ${
    isDark ? 'text-slate-500 hover:text-indigo-400' : 'text-slate-400 hover:text-indigo-600'
  }`}>
    {label}
  </Link>
);

export default RecruiterLayout;