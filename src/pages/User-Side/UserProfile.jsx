import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { User, Briefcase, Plane, Map, Send, ShieldCheck, Lock, Eye, Ticket, Phone, UserCircle, PlusCircle } from 'lucide-react';
import Navbar from '../../components/Navbar';
import io from 'socket.io-client';
import { toast, Toaster } from 'react-hot-toast';

const socket = io.connect("http://localhost:5000");

const UserProfile = () => {
    const [data, setData] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [newContact, setNewContact] = useState("");
    const [isSubmittingContact, setIsSubmittingContact] = useState(false);
    
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (user) {
            fetchProfile();
            socket.emit("join_chat", user.id);
        }
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/users/profile/${user.id}`);
            setData(res.data);
        } catch (err) {
            console.error("Error fetching data", err);
        }
    };

    const handleUpdateContact = async (e) => {
        e.preventDefault();
        if (!newContact) return toast.error("Please enter a number");
        
        setIsSubmittingContact(true);
        try {
            await axios.put(`http://localhost:5000/api/users/profile/update`, {
                userId: user.id,
                contact_number: newContact,
                full_name: data?.profile?.full_name 
            });
            toast.success("Contact number updated!");
            setNewContact("");
            fetchProfile(); 
        } catch (err) {
            toast.error("Failed to update contact");
        } finally {
            setIsSubmittingContact(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#020617] text-white">
            <Toaster position="top-right" reverseOrder={false} />
            <Navbar />
            
            <main className="flex-grow pt-40 px-6 pb-12">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
                    
                    {/* --- Sidebar --- */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem] text-center backdrop-blur-xl sticky top-28">
                            <div className="relative w-28 h-28 mx-auto mb-6">
                                <div className="w-full h-full bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/20">
                                    <User size={48} className="text-white" />
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-[#020617] rounded-full"></div>
                            </div>
                            <h2 className="text-xl font-black uppercase italic tracking-tighter text-blue-400">
                                {data?.profile?.full_name || "Loading..."}
                            </h2>
                            <p className="text-slate-500 text-[10px] font-bold tracking-[0.2em] uppercase mb-6">
                                {data?.profile?.role || "Global Traveler"}
                            </p>
                            
                            <div className="space-y-2">
                                <TabBtn active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} label="Command Center" />
                                <TabBtn active={activeTab === 'applications'} onClick={() => setActiveTab('applications')} label="My Journey" />
                                <TabBtn active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} label="Direct Support" />
                                <TabBtn active={activeTab === 'security'} onClick={() => setActiveTab('security')} label="Security" />
                            </div>
                        </div>
                    </div>

                    {/* --- Main Content --- */}
                    <div className="lg:col-span-3 space-y-8">
                        {activeTab === 'overview' && (
                            <Overview 
                                data={data} 
                                onContactSubmit={handleUpdateContact}
                                contactVal={newContact}
                                setContactVal={setNewContact}
                                isSubmitting={isSubmittingContact}
                            />
                        )}
                        {activeTab === 'applications' && <Applications data={data} />}
                        {activeTab === 'chat' && <SupportChat user={user} />}
                        {activeTab === 'security' && <SecuritySettings user={user} />}
                    </div>
                </div>
            </main>
        </div>
    );
};

// --- Command Center Component ---
const Overview = ({ data, onContactSubmit, contactVal, setContactVal, isSubmitting }) => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard icon={<Plane size={20} />} title="Visas" count={data?.stats?.visas?.length || 0} color="blue" />
            <StatCard icon={<Briefcase size={20} />} title="Job Phases" count={data?.stats?.jobs?.length || 0} color="emerald" />
            <StatCard icon={<Ticket size={20} />} title="Flight Requests" count={data?.stats?.flights?.length || 0} color="purple" />
        </div>
        
        <div className="bg-slate-900/40 border border-slate-800 p-10 rounded-[3.5rem] backdrop-blur-md">
            <div className="mb-10">
                <h3 className="text-2xl font-black uppercase italic flex items-center gap-4">
                    <ShieldCheck className="text-blue-500" size={28} /> Personnel Identity
                </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <InfoItem icon={<UserCircle size={16} />} label="Legal Full Name" value={data?.profile?.full_name} />
                
                <div>
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                        <Phone size={14} /> Primary Contact
                    </p>
                    {data?.profile?.phone_number ? (
                        <p className="text-lg font-bold text-slate-200">{data.profile.phone_number}</p>
                    ) : (
                        <form onSubmit={onContactSubmit} className="mt-2 flex gap-2">
                            <input 
                                type="text" 
                                placeholder="Add Contact Number" 
                                value={contactVal}
                                onChange={(e) => setContactVal(e.target.value)}
                                className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-xs outline-none focus:border-blue-500 w-full"
                            />
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="bg-blue-600 p-2 rounded-xl hover:bg-blue-500 transition-colors"
                            >
                                <PlusCircle size={18} />
                            </button>
                        </form>
                    )}
                </div>

                <InfoItem label="Email Identity" value={data?.profile?.email} />
                <InfoItem label="Passport Number" value={data?.profile?.passport_number || 'N/A'} />
            </div>
        </div>
    </div>
);

// --- My Journey Component ---
const Applications = ({ data }) => {
    const [subTab, setSubTab] = useState('visa');

    const renderContent = () => {
        switch (subTab) {
            case 'visa':
                return (
                    <div className="space-y-4">
                        {data?.stats?.visas?.length > 0 ? data.stats.visas.map(v => (
                            <JourneyCard key={v.id} icon={<Plane className="text-blue-500" />} title={v.destination_country} sub={v.visa_type} status={v.application_status} />
                        )) : <EmptyState message="No Visa Records Found" />}
                    </div>
                );
            case 'job':
                return (
                    <div className="space-y-4">
                        {data?.stats?.jobs?.length > 0 ? data.stats.jobs.map(j => (
                            <JourneyCard key={j.id} icon={<Briefcase className="text-emerald-500" />} title={j.job_title} sub={j.company_name} status={j.status} />
                        )) : <EmptyState message="No Job Applications Found" />}
                    </div>
                );
            case 'tour':
                return (
                    <div className="space-y-4">
                        {data?.stats?.tours?.length > 0 ? data.stats.tours.map(t => (
                            <JourneyCard key={t.id} icon={<Map className="text-amber-500" />} title={t.tour_name} sub={t.destination} status={t.status} />
                        )) : <EmptyState message="No Tour Bookings Found" />}
                    </div>
                );
            case 'flight':
                return (
                    <div className="space-y-4">
                        {data?.stats?.flights?.length > 0 ? data.stats.flights.map(f => (
                            <JourneyCard 
                                key={f.id} 
                                icon={<Ticket className="text-purple-500" />} 
                                title={`${f.departure_city} to ${f.destination_city}`} 
                                sub={`Travel Date: ${new Date(f.travel_date).toLocaleDateString()} | Bill: $${f.total_cost || '0.00'}`} 
                                status={f.status} 
                            />
                        )) : <EmptyState message="No Flight Requests Found" />}
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-wrap gap-3 bg-slate-900/40 p-2 rounded-[2rem] border border-slate-800">
                {['visa', 'job', 'tour', 'flight'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setSubTab(tab)}
                        className={`flex-1 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${subTab === tab ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:bg-slate-800'}`}
                    >
                        {tab} Status
                    </button>
                ))}
            </div>
            <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] overflow-hidden min-h-[300px]">
                <div className="p-2">{renderContent()}</div>
            </div>
        </div>
    );
};

// --- Reusable UI Helpers ---
const JourneyCard = ({ icon, title, sub, status }) => (
    <div className="p-6 flex items-center justify-between border-b border-slate-800/50 last:border-0 hover:bg-slate-800/20 transition-colors">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-800 rounded-2xl">{icon}</div>
            <div>
                <p className="font-black text-sm uppercase italic tracking-tight">{title}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase">{sub}</p>
            </div>
        </div>
        <StatusBadge status={status} />
    </div>
);

const TabBtn = ({ active, onClick, label }) => (
    <button onClick={onClick} className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:bg-slate-800/50'}`}>
        {label}
    </button>
);

const StatCard = ({ icon, title, count, color }) => (
    <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-[2.5rem] flex items-center gap-6">
        <div className={`w-14 h-14 bg-${color}-500/10 rounded-2xl flex items-center justify-center text-${color}-500`}>{icon}</div>
        <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{title}</p>
            <p className="text-3xl font-black italic">{count}</p>
        </div>
    </div>
);

const InfoItem = ({ label, value, icon }) => (
    <div>
        <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1 flex items-center gap-2">
            {icon} {label}
        </p>
        <p className="text-lg font-bold text-slate-200">{value || 'Not Specified'}</p>
    </div>
);

const StatusBadge = ({ status }) => {
    const s = status?.toLowerCase();
    const colors = { 
        approved: 'text-green-400 border-green-400/20 bg-green-400/5', 
        accept: 'text-green-400 border-green-400/20 bg-green-400/5', 
        hold: 'text-blue-400 border-blue-400/20 bg-blue-400/5',
        requested: 'text-amber-400 border-amber-400/20 bg-amber-400/5',
        reject: 'text-red-400 border-red-400/20 bg-red-400/5'
    };
    return <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase border ${colors[s] || 'text-slate-400 border-slate-800'}`}>{status || 'Requested'}</span>;
};

const EmptyState = ({ message }) => <div className="p-20 text-center text-slate-600 font-bold uppercase text-[10px] tracking-widest">{message}</div>;

const SecuritySettings = ({ user }) => {
    const [passwords, setPasswords] = useState({ old: "", new: "", confirm: "" });
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) return toast.error("Passwords mismatch!");
        setLoading(true);
        try {
            await axios.put(`http://localhost:5000/api/users/change-password`, {
                userId: user.id, oldPassword: passwords.old, newPassword: passwords.new
            });
            toast.success("Security updated!");
            setPasswords({ old: "", new: "", confirm: "" });
        } catch (err) {
            toast.error(err.response?.data?.message || "Update failed");
        } finally { setLoading(false); }
    };

    return (
        <div className="bg-slate-900/40 border border-slate-800 p-10 rounded-[3.5rem] backdrop-blur-md animate-in fade-in">
             <div className="mb-10">
                <h3 className="text-2xl font-black uppercase italic flex items-center gap-4"><Lock className="text-blue-500" size={28} /> Security Guard</h3>
            </div>
            <form onSubmit={handleUpdate} className="max-w-md space-y-4">
                <PasswordField label="Current Password" value={passwords.old} show={showPass} onChange={(val) => setPasswords({...passwords, old: val})} />
                <PasswordField label="New Password" value={passwords.new} show={showPass} onChange={(val) => setPasswords({...passwords, new: val})} />
                <PasswordField label="Confirm Password" value={passwords.confirm} show={showPass} onChange={(val) => setPasswords({...passwords, confirm: val})} />
                <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setShowPass(!showPass)} className="p-4 bg-slate-800 rounded-2xl"><Eye size={20} /></button>
                    <button className="flex-1 bg-blue-600 py-4 rounded-2xl font-black uppercase text-xs tracking-widest">{loading ? "Updating..." : "Update Credentials"}</button>
                </div>
            </form>
        </div>
    );
};

const PasswordField = ({ label, value, onChange, show }) => (
    <div>
        <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2 block">{label}</label>
        <input type={show ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)} required className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-sm focus:border-blue-500 outline-none text-white" />
    </div>
);

const SupportChat = ({ user }) => {
    const [msg, setMsg] = useState("");
    const [history, setHistory] = useState([]);
    const scrollRef = useRef();

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/users/messages/${user.id}`);
                setHistory(res.data);
            } catch (err) {}
        };
        fetchMessages();
    }, [user.id]);

    useEffect(() => {
        socket.on("receive_message", (incomingData) => {
            setHistory(prev => [...prev, incomingData]);
        });
        return () => socket.off("receive_message");
    }, []);

    const handleSend = async () => {
        if (!msg.trim()) return;
        const chatData = { sender_id: user.id, receiver_id: 1, message: msg };
        try {
            await axios.post('http://localhost:5000/api/users/messages/send', chatData);
            socket.emit("send_message", chatData);
            setHistory(prev => [...prev, { ...chatData, created_at: new Date() }]);
            setMsg("");
        } catch (err) {}
    };

    return (
        <div className="bg-slate-900/60 border border-slate-800 rounded-[3rem] h-[600px] flex flex-col overflow-hidden relative">
            <div className="p-6 bg-slate-800/50 border-b border-slate-700 flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-black italic text-xs">AD</div>
                <p className="text-sm font-black uppercase italic">Admin Support</p>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {history.map((m, i) => (
                    <div key={i} className={`flex ${m.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-4 rounded-3xl text-xs font-bold ${m.sender_id === user.id ? 'bg-blue-600 rounded-tr-none' : 'bg-slate-800 rounded-tl-none border border-slate-700'}`}>
                            {m.message}
                        </div>
                    </div>
                ))}
                <div ref={scrollRef} />
            </div>
            <div className="p-6 border-t border-slate-700 flex gap-3">
                <input value={msg} onChange={e => setMsg(e.target.value)} className="flex-1 bg-slate-950 border border-slate-700 rounded-full px-6 outline-none text-xs" placeholder="Message..." />
                <button onClick={handleSend} className="bg-blue-600 p-4 rounded-full"><Send size={18} /></button>
            </div>
        </div>
    );
};

export default UserProfile;