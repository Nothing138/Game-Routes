import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { 
  LayoutDashboard, Globe, Briefcase, MapPin, 
  FileText, Users, UserPlus, Menu, X, Bell, LogOut, ChevronDown, 
  PlusCircle, List, Send, CheckCircle, Package, Bookmark,
  BarChart3, MessageSquare, Mail, Sun, Moon 
} from 'lucide-react';

import Footer from '../../components/Admin&Recruiter/Footer';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openMenus, setOpenMenus] = useState({}); 
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  // --- Dark Mode Logic ---
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // --- 🛡️ Unified Role-Based Access Logic ---
  const userRole = localStorage.getItem('role'); 
  
  const isSuperAdmin = userRole === 'superadmin';
  const isAdmin      = userRole === 'admin' || isSuperAdmin; 
  const isHR         = userRole === 'hr_manager' || isAdmin || isSuperAdmin;
  const isModerator  = userRole === 'moderator' || isHR || isAdmin || isSuperAdmin;
  const isRecruiter  = userRole === 'recruiter' || isHR || isAdmin || isSuperAdmin;

  /*const fetchUnreadCount = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/notifications/unread-count');
      setUnreadCount(res.data.count || 0);
    } catch (err) { console.error("Bell sync failed"); }
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);*/

  const toggleMenu = (menuName) => {
    setOpenMenus(prev => ({ ...prev, [menuName]: !prev[menuName] }));
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Logout?',
      text: "Are you sure you want to exit?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, Logout!'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        navigate('/login');
      }
    });
  };

  return (
    <div className={`flex h-screen font-sans overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#F1F5F9]'}`}>
      
      {/* --- SIDEBAR --- */}
      <aside className={`${isSidebarOpen ? 'w-72' : 'w-20'} bg-[#1E293B] text-gray-300 transition-all duration-300 flex flex-col shadow-2xl z-50`}>
        <div className="h-20 flex items-center px-6 bg-red-700 border-b border-gray-800 italic font-black text-white uppercase tracking-tighter shadow-lg shrink-0 text-center">
          {isSidebarOpen ? "Game Routes Agency" : "GR"}
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2 custom-scrollbar">
          {/* Dashboard - Visible to All Staff */}
          <SidebarItem to="/admin/dashboard" icon={<LayoutDashboard size={20}/>} label="Dashboard" isOpen={isSidebarOpen} currentPath={location.pathname} />
          
          {/* Analytics - Super Admin Only */}
          {isSuperAdmin && <SidebarItem to="/admin/analytics" icon={<BarChart3 size={20}/>} label="Analytics" isOpen={isSidebarOpen} currentPath={location.pathname} />}
          
          {/* Visa Application - HR & Admin */}
          {isHR && (
            <SidebarDropdown 
              label="Visa Application" icon={<Globe size={20}/>} isOpen={isSidebarOpen} isMenuOpen={openMenus.visa} onClick={() => toggleMenu('visa')}
              items={[
                { label: 'Visa Categories', to: '/admin/visa-categories', icon: <PlusCircle size={14}/> },
                { label: 'Country List', to: '/admin/country-list', icon: <List size={14}/> },
                { label: 'Applications', to: '/admin/applications', icon: <CheckCircle size={14}/> },
              ]}
            />
          )}

          {/* Job Circular - Recruiter, HR, Admin */}
          {isRecruiter && (
            <SidebarDropdown 
              label="Job Circular" icon={<Briefcase size={20}/>} isOpen={isSidebarOpen} isMenuOpen={openMenus.job} onClick={() => toggleMenu('job')}
              items={[
                { label: 'Post Job', to: '/admin/post-job', icon: <Send size={14}/> },
                { label: 'Job List', to: '/admin/job-list', icon: <List size={14}/> },
                { label: 'Applied Candidates', to: '/admin/candidates', icon: <Users size={14}/> },
                { label: 'Recruiter List', to: '/admin/manage-recruiters', icon: <List size={14}/> },
              ]}
            />
          )}

          {/* Travel & Tour - HR & Admin */}
          {isHR && (
            <SidebarDropdown 
              label="Travel & Tour" icon={<MapPin size={20}/>} isOpen={isSidebarOpen} isMenuOpen={openMenus.travel} onClick={() => toggleMenu('travel')}
              items={[
                { label: 'Tour Packages', to: '/admin/tour-packages', icon: <Package size={14}/> },
                { label: 'Bookings', to: '/admin/bookings', icon: <Bookmark size={14}/> },
              ]}
            />
          )}

          {/* Communications - All Staff (Recruiter, Moderator, HR, Admin) */}
          {isRecruiter && (
            <SidebarDropdown 
              label="Communications" icon={<MessageSquare size={20}/>} isOpen={isSidebarOpen} isMenuOpen={openMenus.chat} onClick={() => toggleMenu('chat')}
              items={[
                { label: 'Inbox / Chat', to: '/admin/notifications', icon: <Mail size={14}/> },
                { label: 'Push Notifications', to: '/admin/push-alerts', icon: <Bell size={14}/> },
              ]}
            />
          )}

          {/* Agency Blog - Moderator, HR, Admin */}
          {isModerator && (
            <SidebarDropdown 
              label="Agency Blog" icon={<FileText size={20}/>} isOpen={isSidebarOpen} isMenuOpen={openMenus.blog} onClick={() => toggleMenu('blog')}
              items={[
                { label: 'Upload Blog', to: '/admin/blogs/create', icon: <PlusCircle size={14}/> },
                { label: 'Blog List', to: '/admin/blogs', icon: <List size={14}/> },
              ]}
            />
          )}

          {/* Staff Management - Moderator, HR, Admin, Superadmin */}
          {isModerator && (
            <SidebarItem to="/admin/staff-management" icon={<UserPlus size={20}/>} label="Staff Management" isOpen={isSidebarOpen} currentPath={location.pathname} />
          )}
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col">
        <header className={`h-20 border-b flex items-center justify-between px-8 shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`p-2.5 rounded-xl border transition-all ${isDarkMode ? 'bg-slate-800 text-gray-300 border-slate-700 hover:text-red-500' : 'bg-gray-50 text-gray-600 border-gray-200 hover:text-red-600'}`}>
              {isSidebarOpen ? <X size={20}/> : <Menu size={20}/>}
            </button>
            <div className="hidden md:block">
               <h1 className={`text-xs font-black uppercase italic tracking-[0.2em] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Management Control Center</h1>
               <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase italic ${isDarkMode ? 'bg-red-700/20 text-red-400 border border-red-700/50' : 'bg-black text-white'}`}>{userRole}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={toggleDarkMode} className={`p-3 rounded-2xl transition-all duration-300 border ${isDarkMode ? 'bg-slate-800 text-yellow-400 border-slate-700 hover:bg-slate-700' : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'}`}>
              {isDarkMode ? <Sun size={20}/> : <Moon size={20}/>}
            </button>

            <div className="relative group">
              <Link to="/admin/push-alerts"> 
                {unreadCount > 0 && <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full border-2 border-white dark:border-slate-800 z-10 animate-ping"></div>}
                <button className={`p-3 rounded-2xl transition-all duration-300 border ${isDarkMode ? 'bg-slate-800 text-slate-400 border-slate-700 hover:text-red-500' : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-red-600'}`}>
                  <Bell size={20}/>
                </button>
              </Link>
            </div>

            <button onClick={handleLogout} className={`flex items-center gap-2 font-black text-[11px] uppercase italic px-5 py-3 rounded-2xl transition-all shadow-sm tracking-widest border ${isDarkMode ? 'bg-slate-800 text-gray-200 border-slate-700 hover:bg-red-600 hover:text-white' : 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-red-600 hover:text-white'}`}>
              <LogOut size={16}/> Logout
            </button>
          </div>
        </header>

        <main className={`flex-1 overflow-y-auto p-8 transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#F8FAFC]'}`}>
          <Outlet context={{ userRole }} />
          <Footer/>
        </main>
      </div>
    </div>
  );
};

// --- Sub Components ---
const SidebarItem = ({ to, icon, label, isOpen, currentPath }) => {
  const isActive = currentPath === to || currentPath.startsWith(to + '/');
  return (
    <Link to={to} className={`flex items-center p-3.5 rounded-xl transition-all ${isActive ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' : 'hover:bg-gray-800 text-gray-400 hover:text-white'}`}>
      {icon}
      {isOpen && <span className="ml-4 text-[13px] font-black uppercase italic tracking-tight">{label}</span>}
    </Link>
  );
};

const SidebarDropdown = ({ label, icon, items, isOpen, isMenuOpen, onClick }) => (
  <div className="space-y-1">
    <button onClick={onClick} className={`w-full flex items-center p-3.5 rounded-xl transition-all hover:bg-gray-800 text-gray-400 hover:text-white`}>
      {icon}
      {isOpen && (
        <div className="flex-1 flex items-center justify-between ml-4">
          <span className="text-[13px] font-black uppercase italic tracking-tight">{label}</span>
          <ChevronDown size={14} className={`transition-transform duration-300 ${isMenuOpen ? 'rotate-180 text-red-600' : ''}`} />
        </div>
      )}
    </button>
    {isOpen && isMenuOpen && (
      <div className="ml-6 space-y-1 border-l border-gray-700 animate-in slide-in-from-top-2">
        {items.map((sub, i) => (
          <Link key={i} to={sub.to} className="flex items-center gap-3 px-6 py-2 text-[11px] font-bold uppercase text-gray-500 hover:text-red-500 transition-colors italic tracking-widest">
            {sub.icon} {sub.label}
          </Link>
        ))}
      </div>
    )}
  </div>
);

export default AdminLayout;