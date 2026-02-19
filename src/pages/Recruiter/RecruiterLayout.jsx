import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FilePlus, Users, UserCircle, LogOut, Briefcase } from 'lucide-react';
import Swal from 'sweetalert2';
import Footer from '../../components/Admin&Recruiter/Footer';

const RecruiterLayout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        Swal.fire('Logged Out', 'Successfully logged out', 'success');
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans">
            {/* --- SIDEBAR --- */}
            <aside className="w-72 bg-black text-white p-6 flex flex-col fixed h-full shadow-2xl">
                <div className="mb-10 px-4">
                    <h1 className="text-2xl font-black italic uppercase tracking-tighter text-white">
                        Elite <span className="text-red-600">Recruiter</span>
                    </h1>
                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[3px]">Authority Portal</p>
                </div>

                <nav className="space-y-2 flex-1">
                    <SidebarLink to="/recruiter/dashboard" icon={<LayoutDashboard size={20}/>} label="Overview" />
                    <SidebarLink to="/recruiter/post-job" icon={<FilePlus size={20}/>} label="Post New Job" />
                    <SidebarLink to="/recruiter/my-jobs" icon={<Briefcase size={20}/>} label="Manage Jobs" />
                    <SidebarLink to="/recruiter/applications" icon={<Users size={20}/>} label="Applications" />
                    <SidebarLink to="/recruiter/profile" icon={<UserCircle size={20}/>} label="Profile" />
                </nav>

                <button 
                    onClick={handleLogout}
                    className="mt-auto flex items-center gap-3 p-4 w-full rounded-2xl bg-red-600 hover:bg-white hover:text-red-600 transition-all font-black italic uppercase text-xs shadow-lg shadow-red-900/20"
                >
                    <LogOut size={20} /> Logout Account
                </button>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 ml-72 p-8">
                {/* Topbar */}
                <header className="bg-white p-6 rounded-[30px] shadow-sm border border-gray-100 mb-8 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                        <h2 className="font-black italic uppercase text-slate-800 tracking-tight">Recruiter Command Center</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-[10px] font-black text-gray-400 uppercase">Current Session</p>
                            <p className="text-xs font-bold italic text-slate-900">Active Authority</p>
                        </div>
                        <div className="w-10 h-10 bg-slate-900 rounded-xl"></div>
                    </div>
                </header>

                {/* Page Content Rendered Here */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <Outlet />
                    <Footer />
                </div>
            </main>
        </div>
    );
};

// Sidebar Link Component for Reusability
const SidebarLink = ({ to, icon, label }) => (
    <Link 
        to={to} 
        className="flex items-center gap-4 p-4 rounded-2xl hover:bg-red-600 transition-all group font-bold italic uppercase text-[11px] tracking-wider"
    >
        <span className="text-red-600 group-hover:text-white transition-colors">{icon}</span>
        <span className="group-hover:translate-x-1 transition-transform">{label}</span>
    </Link>
);

export default RecruiterLayout;