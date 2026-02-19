import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { 
  LayoutDashboard, Globe, Briefcase, MapPin, 
  FileText, Users, UserPlus, Menu, X, Bell, LogOut, ChevronDown, 
  PlusCircle, List, Send, CheckCircle, Package, Bookmark,
  BarChart3, MessageSquare, Mail
} from 'lucide-react';

import Footer from '../../components/Admin&Recruiter/Footer';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openMenus, setOpenMenus] = useState({}); 
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  // --- Get User Data from Storage ---
  const userRole = localStorage.getItem('role'); // e.g., 'editor', 'moderator', 'hr_manager', 'superadmin'

  // --- Role Access Logic ---
  const isSuperAdmin = userRole === 'superadmin';
  const isHR = userRole === 'hr_manager' || isSuperAdmin;
  const isEditor = userRole === 'editor' || isSuperAdmin;
  const isModerator = userRole === 'moderator' || isSuperAdmin;

  const fetchUnreadCount = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/notifications/unread-count');
      setUnreadCount(res.data.count || 0);
    } catch (err) { console.error("Bell sync failed"); }
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

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
    <div className="flex h-screen bg-[#F1F5F9] font-sans overflow-hidden">
      {/* --- SIDEBAR --- */}
      <aside className={`${isSidebarOpen ? 'w-72' : 'w-20'} bg-[#1E293B] text-gray-300 transition-all duration-300 flex flex-col shadow-2xl z-50`}>
        <div className="h-20 flex items-center px-6 bg-red-700 border-b border-gray-800 italic font-black text-white uppercase tracking-tighter shadow-lg shrink-0 text-center">
          {isSidebarOpen ? "Game Routes Agency" : "GR"}
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2 custom-scrollbar">
          
          {/* 1. Dashboard - Everyone in Admin Panel can see */}
          <SidebarItem to="/admin/dashboard" icon={<LayoutDashboard size={20}/>} label="Dashboard" isOpen={isSidebarOpen} currentPath={location.pathname} />

          {/* 2. Analytics - SuperAdmin only */}
          {isSuperAdmin && (
            <SidebarItem to="/admin/analytics" icon={<BarChart3 size={20}/>} label="Analytics & Stats" isOpen={isSidebarOpen} currentPath={location.pathname} />
          )}

          {/* 3. Visa Application - HR & SuperAdmin */}
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

          {/* 4. Job Circular - HR & SuperAdmin */}
          {isHR && (
            <SidebarDropdown 
              label="Job Circular" icon={<Briefcase size={20}/>} isOpen={isSidebarOpen} isMenuOpen={openMenus.job} onClick={() => toggleMenu('job')}
              items={[
                { label: 'Post Job', to: '/admin/post-job', icon: <Send size={14}/> },
                { label: 'Applied Candidates', to: '/admin/candidates', icon: <Users size={14}/> },
                //{ label: 'Recruiter List', to: '/admin/recruiters', icon: <List size={14}/> },
                { label: 'Recruiter List', to: '/admin/manage-recruiters', icon: <List size={14}/> },
              ]}
            />
          )}

          {/* 5. Travel & Tour - HR & SuperAdmin */}
          {isHR && (
            <SidebarDropdown 
              label="Travel & Tour" icon={<MapPin size={20}/>} isOpen={isSidebarOpen} isMenuOpen={openMenus.travel} onClick={() => toggleMenu('travel')}
              items={[
                { label: 'Tour Packages', to: '/admin/tour-packages', icon: <Package size={14}/> },
                { label: 'Bookings', to: '/admin/bookings', icon: <Bookmark size={14}/> },
              ]}
            />
          )}

          {/* 6. Communications - Editor, HR & SuperAdmin */}
          {(isEditor || isHR) && (
            <SidebarDropdown 
              label="Communications" icon={<MessageSquare size={20}/>} isOpen={isSidebarOpen} isMenuOpen={openMenus.chat} onClick={() => toggleMenu('chat')}
              items={[
                { label: 'Inbox / Chat', to: '/admin/notifications', icon: <Mail size={14}/> },
                { label: 'Push Notifications', to: '/admin/push-alerts', icon: <Bell size={14}/> },
              ]}
            />
          )}

          {/* 7. Agency Blog - Editor, Moderator, HR & SuperAdmin */}
          {(isEditor || isModerator || isHR) && (
            <SidebarDropdown 
              label="Agency Blog" icon={<FileText size={20}/>} isOpen={isSidebarOpen} isMenuOpen={openMenus.blog} onClick={() => toggleMenu('blog')}
              items={[
                { label: 'Upload Blog', to: '/admin/blogs/create', icon: <PlusCircle size={14}/> },
                { label: 'Blog List', to: '/admin/blogs', icon: <List size={14}/> },
              ]}
            />
          )}

          {/* 8. Staff Management - Moderator & SuperAdmin */}
          {(isModerator || isSuperAdmin) && (
            <SidebarItem to="/admin/staff-management" icon={<UserPlus size={20}/>} label="Staff Management" isOpen={isSidebarOpen} currentPath={location.pathname} />
          )}

        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col">
        <header className="h-20 bg-white border-b flex items-center justify-between px-8 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2.5 bg-gray-50 rounded-xl hover:text-red-600 border transition-all">
              {isSidebarOpen ? <X size={20}/> : <Menu size={20}/>}
            </button>
            <div className="hidden md:block">
               <h1 className="text-xs font-black uppercase italic text-gray-400 tracking-[0.2em]">Management Control Center</h1>
               <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded font-bold uppercase italic">{userRole}</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group">
              <Link to="/admin/push-alerts"> 
                {unreadCount > 0 && (
                  <>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full border-2 border-white z-10 animate-ping"></div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full border-2 border-white z-10 flex items-center justify-center text-[8px] font-bold text-white">{unreadCount}</div>
                  </>
                )}
                <button className="p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:text-red-600 group-hover:bg-red-50 transition-all duration-300">
                  <Bell size={22}/>
                </button>
              </Link>
            </div>

            <button onClick={handleLogout} className="flex items-center gap-2 text-slate-800 font-black text-[11px] uppercase italic bg-slate-100 px-5 py-3 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm tracking-widest">
              <LogOut size={16}/> Logout
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC]">
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