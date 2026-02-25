import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Megaphone, Save, Power, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';

const AnnouncementManager = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [content, setContent] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [loading, setLoading] = useState(true);

    const fetchAnnouncements = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/announcements/all");
            setAnnouncements(res.data.announcements);
            setLoading(false);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchAnnouncements(); }, []);

    // Notun Announcement Add kora
    const handleCreate = async () => {
        if (!content.trim()) return;
        try {
            await axios.post("http://localhost:5000/api/announcements/save", {
                content,
                is_active: isActive ? 1 : 0
            });
            setContent("");
            Swal.fire({ title: 'Deployed!', icon: 'success', toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
            fetchAnnouncements();
        } catch (err) { console.error(err); }
    };

    // Status Toggle kora
    const toggleStatus = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 1 ? 0 : 1;
            await axios.put(`http://localhost:5000/api/announcements/toggle/${id}`, { is_active: newStatus });
            fetchAnnouncements();
        } catch (err) { console.error(err); }
    };

    // Delete kora
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Delete this?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            background: '#18181b',
            color: '#fff'
        });

        if (result.isConfirmed) {
            await axios.delete(`http://localhost:5000/api/announcements/${id}`);
            fetchAnnouncements();
            Swal.fire('Deleted!', 'Announcement removed.', 'success');
        }
    };

    return (
        <div className="p-6 md:p-10 min-h-screen bg-[#0b0e11] text-zinc-300">
            <div className="max-w-6xl mx-auto space-y-10">
                
                {/* --- TOP: Create Section --- */}
                <div className="bg-[#111b21] border border-zinc-800 p-8 rounded-[40px] shadow-2xl">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-4 bg-red-600/20 rounded-2xl text-red-600">
                            <Megaphone size={32} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Broadcast Center</h2>
                            <p className="text-zinc-500 text-sm">Create and manage live scrolling announcements.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-end">
                        <div className="lg:col-span-2">
                            <label className="text-[10px] font-black uppercase text-zinc-500 ml-2 mb-2 block tracking-widest">Message Content</label>
                            <input 
                                className="w-full p-5 bg-zinc-900 border border-zinc-800 rounded-2xl text-white font-bold outline-none focus:border-red-600 transition-all"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Write your announcement here..."
                            />
                        </div>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setIsActive(!isActive)}
                                className={`flex-1 p-5 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-2 border transition-all ${isActive ? 'bg-green-600/10 border-green-600 text-green-500' : 'bg-zinc-800 border-zinc-700 text-zinc-500'}`}
                            >
                                <Power size={18} /> {isActive ? 'Active' : 'Draft'}
                            </button>
                            <button 
                                onClick={handleCreate}
                                className="flex-[2] py-5 bg-red-600 hover:bg-white hover:text-red-600 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-3"
                            >
                                <Save size={20} /> Deploy
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- BOTTOM: History List --- */}
                <div className="space-y-4">
                    <h3 className="text-xl font-black uppercase italic text-zinc-500 flex items-center gap-2 ml-4">
                        <Clock size={20} /> Recent Broadcasts
                    </h3>
                    
                    <div className="grid grid-cols-1 gap-4">
                        {announcements.map((ann) => (
                            <div key={ann.id} className={`group bg-[#111b21] border border-zinc-800 p-6 rounded-[30px] flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:border-zinc-600 ${ann.is_active === 0 ? 'opacity-50' : ''}`}>
                                <div className="flex items-center gap-6 flex-1">
                                    <div className={`p-3 rounded-full ${ann.is_active ? 'bg-green-500/10 text-green-500' : 'bg-zinc-800 text-zinc-600'}`}>
                                        {ann.is_active ? <CheckCircle size={24} /> : <XCircle size={24} />}
                                    </div>
                                    <p className="text-white font-bold italic text-lg leading-tight">{ann.content}</p>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={() => toggleStatus(ann.id, ann.is_active)}
                                        className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest border transition-all ${ann.is_active ? 'border-zinc-700 text-zinc-500 hover:bg-zinc-800' : 'border-green-600 text-green-500 hover:bg-green-600 hover:text-white'}`}
                                    >
                                        {ann.is_active ? 'Disable' : 'Enable'}
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(ann.id)}
                                        className="p-3 bg-red-600/10 text-red-600 border border-red-600/20 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AnnouncementManager;