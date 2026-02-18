import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Mail, Bell, Send, User, Trash2, ShieldAlert, MessageSquare } from 'lucide-react';

const CommunicationCenter = () => {
    const [activeTab, setActiveTab] = useState('inbox');
    const [inbox, setInbox] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [formData, setFormData] = useState({ title: '', message: '', type: 'message' });

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        try {
            if (activeTab === 'inbox') {
                const res = await axios.get('http://localhost:5000/api/admin/inbox-summary');
                setInbox(res.data);
            } else {
                const res = await axios.get('http://localhost:5000/api/admin/notifications/latest');
                setNotifications(res.data);
            }
        } catch (err) { console.error("Sync Error"); }
    };

    const handleBroadcast = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/admin/notifications', formData);
            Swal.fire('Dispatched!', 'Global notification is active.', 'success');
            setFormData({ title: '', message: '', type: 'message' });
            fetchData();
        } catch (err) { Swal.fire('Error', 'Dispatch failed', 'error'); }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header with Navigation */}
            <div className="bg-white p-6 rounded-[35px] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-900 text-white rounded-2xl">
                        <MessageSquare size={24} />
                    </div>
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter">Communication Hub</h2>
                </div>
                
                <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                    <button 
                        onClick={() => setActiveTab('inbox')}
                        className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'inbox' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                        Inbox
                    </button>
                    <button 
                        onClick={() => setActiveTab('notifications')}
                        className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'notifications' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                        Push Alerts
                    </button>
                </div>
            </div>

            {activeTab === 'inbox' ? (
                /* --- INBOX UI --- */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 space-y-4 max-h-[600px] overflow-y-auto pr-2">
                        {inbox.map(chat => (
                            <div key={chat.id} className="bg-white p-5 rounded-3xl border border-slate-100 hover:border-red-600 cursor-pointer transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 font-bold group-hover:bg-red-50 group-hover:text-red-600">
                                        {chat.full_name[0]}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-sm uppercase italic">{chat.full_name}</h4>
                                        <p className="text-[10px] text-slate-400 truncate max-w-[150px]">{chat.message}</p>
                                    </div>
                                    <span className="text-[9px] font-black text-slate-300 italic">{new Date(chat.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="lg:col-span-2 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200 flex items-center justify-center">
                        <p className="text-slate-400 font-black italic uppercase text-xs tracking-widest">Select a conversation to start chat</p>
                    </div>
                </div>
            ) : (
                /* --- NOTIFICATIONS UI --- */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4">
                        <form onSubmit={handleBroadcast} className="bg-slate-900 p-8 rounded-[40px] text-white space-y-4">
                            <h3 className="font-black italic uppercase text-sm mb-4 flex items-center gap-2">
                                <Bell size={18} className="text-red-500" /> Dispatch Alert
                            </h3>
                            <input 
                                type="text" placeholder="Title" 
                                className="w-full bg-slate-800 border-none rounded-2xl p-4 text-xs font-bold"
                                value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required
                            />
                            <select 
                                className="w-full bg-slate-800 border-none rounded-2xl p-4 text-xs font-bold"
                                value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}
                            >
                                <option value="message">General</option>
                                <option value="alert">Critical</option>
                                <option value="update">System</option>
                            </select>
                            <textarea 
                                placeholder="Write message..." 
                                className="w-full bg-slate-800 border-none rounded-2xl p-4 text-xs font-bold h-32"
                                value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} required
                            ></textarea>
                            <button className="w-full bg-red-600 p-4 rounded-2xl font-black uppercase text-xs hover:bg-white hover:text-red-600 transition-all">
                                Send Broadcast
                            </button>
                        </form>
                    </div>
                    <div className="lg:col-span-8 space-y-4">
                        {notifications.map(note => (
                            <div key={note.id} className="bg-white p-6 rounded-[30px] border border-slate-100 flex justify-between items-center">
                                <div className="flex gap-4">
                                    <div className={`p-3 rounded-xl ${note.type === 'alert' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                        <ShieldAlert size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-black uppercase text-xs italic">{note.title}</h4>
                                        <p className="text-xs text-slate-500 mt-1">{note.message}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommunicationCenter;