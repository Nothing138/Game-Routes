import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Bell, Send, ShieldAlert, Clock, Trash2 } from 'lucide-react';

const PushNotificationCenter = () => {
    const [notifications, setNotifications] = useState([]);
    const [formData, setFormData] = useState({ title: '', message: '', type: 'message' });

    useEffect(() => { fetchNotifications(); }, []);

    const fetchNotifications = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/notifications/latest');
            setNotifications(res.data);
        } catch (err) { console.error("Sync Error"); }
    };

    const handleBroadcast = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/admin/notifications', formData);
            Swal.fire({
                title: 'Broadcast Active',
                text: 'Global notification is now live.',
                icon: 'success',
                confirmButtonColor: '#B91C1C'
            });
            setFormData({ title: '', message: '', type: 'message' });
            fetchNotifications();
        } catch (err) { Swal.fire('Error', 'Dispatch failed', 'error'); }
    };

    // --- NEW: Delete Logic ---
    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Remove Alert?',
            text: "This will remove the notification for all users.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#B91C1C',
            cancelButtonColor: '#1e293b',
            confirmButtonText: 'Yes, Delete It!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:5000/api/admin/notifications/${id}`);
                    Swal.fire('Purged!', 'Notification has been removed.', 'success');
                    fetchNotifications(); // UI refresh
                } catch (err) {
                    Swal.fire('Error', 'Could not delete', 'error');
                }
            }
        });
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Control Panel */}
                <div className="lg:col-span-4 bg-slate-900 p-8 rounded-[45px] text-white shadow-2xl relative overflow-hidden">
                     <Bell className="absolute -top-10 -left-10 opacity-5 text-white" size={180} />
                     <h3 className="text-xl font-black italic uppercase mb-6 flex items-center gap-2">
                        <Send size={20} className="text-red-600"/> Dispatch Center
                     </h3>
                     <form onSubmit={handleBroadcast} className="space-y-4 relative z-10">
                        <input 
                            type="text" placeholder="ALERT TITLE" 
                            className="w-full p-4 bg-slate-800 rounded-2xl border-none font-bold text-xs uppercase italic text-white"
                            value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required
                        />
                        <select 
                            className="w-full p-4 bg-slate-800 rounded-2xl border-none font-bold text-xs uppercase italic text-white"
                            value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}
                        >
                            <option value="message">Standard Update</option>
                            <option value="alert">Critical Alert</option>
                            <option value="update">Maintenance</option>
                        </select>
                        <textarea 
                            placeholder="MESSAGE CONTENT..." 
                            className="w-full p-4 bg-slate-800 rounded-2xl border-none font-bold text-xs h-32 text-white"
                            value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} required
                        ></textarea>
                        <button className="w-full bg-red-600 p-4 rounded-2xl font-black uppercase italic text-xs tracking-widest hover:bg-white hover:text-red-600 transition-all duration-300 shadow-xl">
                            Deploy Broadcast
                        </button>
                     </form>
                </div>

                {/* Live Feed */}
                <div className="lg:col-span-8 space-y-4 max-h-[650px] overflow-y-auto pr-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-4 ml-4">Live Broadcast Feed</h4>
                    {notifications.map(note => (
                        <div key={note.id} className="bg-white p-6 rounded-[35px] border border-slate-50 flex justify-between items-center group hover:border-red-600 transition-all duration-300 shadow-sm">
                            <div className="flex gap-5">
                                <div className={`p-4 rounded-2xl ${note.type === 'alert' ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-600'}`}>
                                    <ShieldAlert size={22} />
                                </div>
                                <div>
                                    <h5 className="font-black uppercase italic text-sm text-slate-900 tracking-tight">{note.title}</h5>
                                    <p className="text-slate-500 text-xs font-medium mt-1">{note.message}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Clock size={12} className="text-slate-300"/>
                                        <span className="text-[9px] font-black text-slate-300 uppercase italic">
                                            {new Date(note.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* DELETE BUTTON */}
                            <button 
                                onClick={() => handleDelete(note.id)}
                                className="p-3 bg-gray-50 text-gray-400 hover:bg-red-600 hover:text-white rounded-2xl transition-all duration-300"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PushNotificationCenter;