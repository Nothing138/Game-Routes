import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { User, Briefcase, Plane, Map, Send, Edit3, ShieldCheck, Smile, Lock, Eye, EyeOff, X } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import io from 'socket.io-client';
import EmojiPicker from 'emoji-picker-react';
import { toast, Toaster } from 'react-hot-toast';

const socket = io.connect("http://localhost:5000");

const UserProfile = () => {
    const [data, setData] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchProfile();
        if (user) {
            socket.emit("join_chat", user.id);
        }
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/users/profile/${user.id}`);
            setData(res.data);
        } catch (err) {
            console.error("Error fetching profile", err);
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
                            {/* User Name and Role Display */}
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
                                onEditClick={() => setIsEditModalOpen(true)} 
                            />
                        )}
                        {activeTab === 'applications' && <Applications data={data} />}
                        {activeTab === 'chat' && <SupportChat user={user} />}
                        {activeTab === 'security' && <SecuritySettings user={user} />}
                    </div>
                </div>
            </main>

            {/* --- Edit Profile Modal --- */}
            {isEditModalOpen && (
                <EditProfileModal 
                    user={user} 
                    currentData={data?.profile} 
                    onClose={() => setIsEditModalOpen(false)} 
                    onSuccess={fetchProfile}
                />
            )}


        </div>
    );
};

// --- Edit Profile Modal Component ---

const EditProfileModal = ({ user, currentData, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        full_name: currentData?.full_name || '',
        passport_number: currentData?.passport_number || '',
        profession: currentData?.profession || '',
        current_location: currentData?.current_location || ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.put(`http://localhost:5000/api/users/profile/update`, {
                userId: user.id,
                ...formData
            });

            if (response.data.success) {
                toast.success("Profile updated successfully!");
                onSuccess(); // Eita fetchProfile ke call korbe
                onClose();
            }
            
        } catch (err) {
            toast.error("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="p-8 border-b border-slate-800 flex justify-between items-center">
                    <h3 className="text-xl font-black uppercase italic flex items-center gap-3">
                        <Edit3 className="text-blue-500" size={24} /> Edit Identity
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-5">
                    <div>
                        <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2 block">Full Name</label>
                        <input 
                            type="text"
                            value={formData.full_name}
                            onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-3 text-sm focus:border-blue-500 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Email (Non-Editable)</label>
                        <input 
                            type="text"
                            value={currentData?.email}
                            disabled
                            className="w-full bg-slate-950/30 border border-slate-800 rounded-2xl px-5 py-3 text-sm text-slate-600 cursor-not-allowed italic"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2 block">Passport No</label>
                            <input 
                                type="text"
                                value={formData.passport_number}
                                onChange={(e) => setFormData({...formData, passport_number: e.target.value})}
                                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-3 text-sm focus:border-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2 block">Location</label>
                            <input 
                                type="text"
                                value={formData.current_location}
                                onChange={(e) => setFormData({...formData, current_location: e.target.value})}
                                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-3 text-sm focus:border-blue-500 outline-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2 block">Profession</label>
                        <input 
                            type="text"
                            value={formData.profession}
                            onChange={(e) => setFormData({...formData, profession: e.target.value})}
                            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-3 text-sm focus:border-blue-500 outline-none"
                        />
                    </div>

                    <div className="pt-4">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all shadow-lg shadow-blue-600/20"
                        >
                            {loading ? "Syncing..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Overview Component with Active Edit Button ---

const Overview = ({ data, onEditClick }) => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard icon={<Plane size={20} />} title="Visas" count={data?.stats?.visas?.length || 0} color="blue" />
            <StatCard icon={<Briefcase size={20} />} title="Job Phases" count={data?.stats?.jobs?.length || 0} color="emerald" />
            <StatCard icon={<Map size={20} />} title="Active Tours" count={data?.stats?.tours?.length || 0} color="amber" />
        </div>
        <div className="bg-slate-900/40 border border-slate-800 p-10 rounded-[3.5rem] backdrop-blur-md">
            <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-black uppercase italic flex items-center gap-4">
                    <ShieldCheck className="text-blue-500" size={28} /> Personal Documents
                </h3>
                <button 
                    onClick={onEditClick}
                    className="flex items-center gap-2 px-6 py-2 bg-slate-800 rounded-full text-xs font-bold hover:bg-blue-600 transition-colors uppercase tracking-widest border border-slate-700"
                >
                    <Edit3 size={14} /> Edit Profile
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <InfoItem label="Email Identity" value={data?.profile?.email} />
                <InfoItem label="Passport Number" value={data?.profile?.passport_number || 'N/A'} />
                <InfoItem label="Current Profession" value={data?.profile?.profession || 'Professional'} />
                <InfoItem label="Current Location" value={data?.profile?.current_location || 'Not Specified'} />
            </div>
        </div>
    </div>
);

// --- Sub-components (Applications, SecuritySettings, StatCard, etc. same as before) ---
// (Briefly including to ensure logic is kept)

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
    const [showEmoji, setShowEmoji] = useState(false);
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

const Applications = ({ data }) => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <section>
            <h4 className="text-blue-500 font-black uppercase text-xs tracking-[0.3em] mb-4 ml-2">Visa Status</h4>
            <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] overflow-hidden">
                {data?.stats?.visas.map(v => (
                    <div key={v.id} className="p-6 flex items-center justify-between border-b border-slate-800 last:border-0">
                        <div className="flex items-center gap-4">
                            <Plane className="text-blue-500" />
                            <div>
                                <p className="font-black text-sm uppercase">{v.destination_country}</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase">{v.visa_type}</p>
                            </div>
                        </div>
                        <StatusBadge status={v.application_status} />
                    </div>
                ))}
            </div>
        </section>
    </div>
);

const TabBtn = ({ active, onClick, label }) => (
    <button onClick={onClick} className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-800/50'}`}>
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

const InfoItem = ({ label, value }) => (
    <div>
        <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-lg font-bold text-slate-200">{value}</p>
    </div>
);

const StatusBadge = ({ status }) => {
    const colors = { approved: 'text-green-500 border-green-500/20', pending: 'text-amber-500 border-amber-500/20' };
    return <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase border ${colors[status] || 'text-slate-400'}`}>{status}</span>;
};

const EmptyState = ({ message }) => <div className="p-10 text-center text-slate-600 font-bold uppercase text-[10px]">{message}</div>;

export default UserProfile;