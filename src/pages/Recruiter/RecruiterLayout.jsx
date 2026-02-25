import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Briefcase, Users, UserCircle, 
  ChevronDown, ChevronRight, PlusCircle, 
  LogOut, MessageSquare, ShieldCheck,
  Sun, Moon, AlertCircle
} from 'lucide-react';

const RecruiterLayout = () => {
  const [openMenus, setOpenMenus] = useState({ jobs: true, talent: true, messages: true });
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const [hasNewApplicant, setHasNewApplicant] = useState(true);
  
  // --- 🔒 PROFILE COMPLETION STATE ---
  // 0 = Incomplete, 1 = Complete (Real logic-e eita backend theke ashbe)
  const [profileStatus, setProfileStatus] = useState(0); 

  const location = useLocation();
  const navigate = useNavigate();

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

  const toggleMenu = (menu) => {
    if (profileStatus === 0) return; // Profile incomplete thakle menu toggle bondho
    setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  return (
    <div className={`flex min-h-screen font-sans transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-slate-200' : 'bg-[#F8FAFC] text-slate-700'}`}>
      
      {/* 🌲 SIDEBAR */}
      <aside className={`w-72 border-r flex flex-col fixed h-full z-50 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
        
        {/* Branding */}
        <div className="p-6 pb-2">
          <div className={`flex items-center gap-3 p-3 rounded-2xl border transition-colors ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-indigo-50/50 border-indigo-100/50'} mb-2`}>
            <div className="w-10 h-10 bg-indigo-600 rounded-xl shadow-lg flex items-center justify-center text-white font-black overflow-hidden uppercase">
                {profileStatus === 1 ? "J" : "?"}
            </div>
            <div className="overflow-hidden">
              <h1 className={`text-xs font-black truncate uppercase ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                {profileStatus === 1 ? "JM-IT Solutions" : "New Recruiter"}
              </h1>
              <p className="text-[9px] font-bold text-indigo-500 uppercase tracking-tighter italic">
                Powered by Game Routes
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto pt-4">
          {/* Dashboard always accessible */}
          <MenuLink to="/recruiter/dashboard" icon={<LayoutDashboard size={18}/>} label="Overview" active={location.pathname === '/recruiter/dashboard'} isDark={isDarkMode} />

          {/* Locked Sections if profileStatus === 0 */}
          <div className={profileStatus === 0 ? "opacity-40 pointer-events-none grayscale" : ""}>
            {/* Hiring Desk */}
            <TreeGroup label="Hiring Desk" icon={<Briefcase size={18}/>} isOpen={openMenus.jobs} onClick={() => toggleMenu('jobs')} isDark={isDarkMode}>
                <SubMenuLink to="/recruiter/post-job" label="Post a Job" isDark={isDarkMode} />
                <SubMenuLink to="/recruiter/my-jobs" label="Active Listings" isDark={isDarkMode} />
                <Link 
                    to="/recruiter/applications" 
                    onClick={() => setHasNewApplicant(false)}
                    className={`flex items-center justify-between p-2 pl-4 text-[11px] font-bold transition-all italic hover:text-indigo-500 ${location.pathname === '/recruiter/applications' ? 'text-indigo-500' : ''}`}
                >
                    <span>New Applications</span>
                    {hasNewApplicant && (
                        <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border-2 border-white dark:border-slate-900 shadow-sm"></span>
                    )}
                </Link>
            </TreeGroup>

            {/* Messaging Hub */}
            <TreeGroup label="Messaging Hub" icon={<MessageSquare size={18}/>} isOpen={openMenus.messages} onClick={() => toggleMenu('messages')} isDark={isDarkMode}>
                <SubMenuLink to="/recruiter/messages/admin" label="Game Routes Support" isDark={isDarkMode} icon={<ShieldCheck size={12} className="text-red-500 inline mr-2"/>} />
                <SubMenuLink to="/recruiter/messages/users" label="Talent Inbox" isDark={isDarkMode} icon={<Users size={12} className="text-indigo-500 inline mr-2"/>} />
            </TreeGroup>
          </div>

          {/* Profile link always accessible so they can complete it */}
          <MenuLink to="/recruiter/profile" icon={<UserCircle size={18}/>} label="Company Profile" active={location.pathname.includes('profile')} isDark={isDarkMode} />
        </nav>

        {/* LOGOUT */}
        <div className={`p-4 mt-auto border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-50'}`}>
          <button 
            onClick={() => { localStorage.clear(); navigate('/login'); }}
            className="w-full flex items-center justify-center gap-2 p-3 bg-slate-900 text-white rounded-xl font-bold uppercase text-[10px] hover:bg-red-600 transition-all shadow-lg"
          >
            <LogOut size={16} /> Logout Account
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-72 relative">
        {/* Header */}
        <header className={`h-20 backdrop-blur-xl border-b sticky top-0 z-40 px-10 flex justify-between items-center transition-colors duration-300 ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-100'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full animate-pulse ${profileStatus === 1 ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
            <h2 className={`font-bold text-sm tracking-tight uppercase italic ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                {profileStatus === 1 ? "Command Center" : "Action Required"}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2.5 rounded-xl transition-all border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-yellow-400' : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-indigo-600'}`}
            >
              {isDarkMode ? <Sun size={20} fill="currentColor" /> : <Moon size={20} />}
            </button>
            
            <Link 
                to={profileStatus === 1 ? "/recruiter/post-job" : "#"} 
                className={`px-5 py-2.5 rounded-xl font-bold text-[11px] flex items-center gap-2 transition-all uppercase tracking-wider ${profileStatus === 1 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 hover:scale-105' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
            >
              <PlusCircle size={16} /> Quick Post
            </Link>
          </div>
        </header>

        {/* 🛡️ PROFILE COMPLETION OVERLAY */}
        {profileStatus === 0 && location.pathname !== '/recruiter/profile' && (
            <div className="fixed inset-0 z-[100] ml-72 mt-20 flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px]">
                <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] max-w-md text-center shadow-2xl border border-indigo-500/20 m-6">
                    <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-3xl flex items-center justify-center mx-auto mb-6 text-amber-600 rotate-3">
                        <AlertCircle size={44} strokeWidth={2.5} />
                    </div>
                    <h2 className="text-2xl font-black mb-3 dark:text-white uppercase tracking-tight">Complete Your Profile</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed">
                        Vaiya, apnar dashboard active korte hole prothome company details complete korte hobe. Erpor-i baki features unlocked hobe.
                    </p>
                    <button 
                        onClick={() => navigate('/recruiter/profile')}
                        className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/30 active:scale-95"
                    >
                        Setup Profile Now
                    </button>
                </div>
            </div>
        )}

        <div className="p-8">
          <Outlet context={{ isDarkMode, setProfileStatus }} />
        </div>
      </main>
    </div>
  );
};

// --- Helper Components ---
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
    {isOpen && <div className="ml-4 pl-4 border-l border-slate-100 dark:border-slate-800 space-y-1">{children}</div>}
  </div>
);

const SubMenuLink = ({ to, label, isDark, icon }) => (
  <Link to={to} className={`block p-2 pl-4 text-[10px] font-bold uppercase tracking-tight transition-all italic ${
    isDark ? 'text-slate-500 hover:text-indigo-400' : 'text-slate-400 hover:text-indigo-600'
  }`}>
    {icon}{label}
  </Link>
);

export default RecruiterLayout;