import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import EmojiPicker from 'emoji-picker-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Smile, User, Search, MoreVertical, CheckCheck } from 'lucide-react';

const socket = io("http://localhost:5000");

const Inbox = () => {
    const [users, setUsers] = useState([]); // Chat list
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [showEmoji, setShowEmoji] = useState(false);
    const scrollRef = useRef();

    const adminId = 1; // Assuming Admin ID is 1

    // 1. Fetch Chat List (Jader sathe kotha hoise)
    useEffect(() => {
        const fetchChatList = async () => {
            const res = await axios.get("http://localhost:5000/api/messages/chat-list");
            setUsers(res.data.users);
        };
        fetchChatList();
    }, []);

    // 2. Room Join & History Load
    useEffect(() => {
        if (selectedUser) {
            const room = [adminId, selectedUser.id].sort().join("_");
            socket.emit("join_chat", { room });

            const fetchHistory = async () => {
                const res = await axios.get(`http://localhost:5000/api/messages/history/${adminId}/${selectedUser.id}`);
                setMessages(res.data.messages);
            };
            fetchHistory();
        }
    }, [selectedUser]);

    // 3. Listen for Messages
    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessages((prev) => [...prev, data]);
        });
        return () => socket.off("receive_message");
    }, []);

    // 4. Scroll to Bottom
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // 5. Send Message Logic
    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;

        const room = [adminId, selectedUser.id].sort().join("_");
        const messageData = {
            room,
            sender_id: adminId,
            receiver_id: selectedUser.id,
            message: newMessage,
            created_at: new Date()
        };

        // Real-time send
        socket.emit("send_message", messageData);
        
        // Save to Database
        await axios.post("http://localhost:5000/api/messages/send", messageData);

        setNewMessage("");
        setShowEmoji(false);
    };

    const onEmojiClick = (emojiData) => {
        setNewMessage(prev => prev + emojiData.emoji);
    };

    return (
        <div className="flex h-[85vh] bg-[#0b0e11] text-zinc-300 rounded-[40px] overflow-hidden border border-zinc-800 shadow-2xl mx-4 my-6">
            
            {/* --- SIDEBAR: User List --- */}
            <div className="w-1/3 border-r border-zinc-800 bg-[#111b21]/50 backdrop-blur-xl flex flex-col">
                <div className="p-6 border-b border-zinc-800">
                    <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-4">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-zinc-500" size={18} />
                        <input className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-3 pl-10 pr-4 outline-none focus:border-red-600 transition-all text-sm" placeholder="Search candidates..." />
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {users.map(user => (
                        <div 
                            key={user.id} 
                            onClick={() => setSelectedUser(user)}
                            className={`flex items-center gap-4 p-5 cursor-pointer transition-all ${selectedUser?.id === user.id ? 'bg-red-600/10 border-r-4 border-red-600' : 'hover:bg-zinc-800/30'}`}
                        >
                            <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-red-600 to-orange-400 flex items-center justify-center text-white font-bold">
                                {user.full_name[0]}
                            </div>
                            <div className="flex-1">
                                <h4 className="text-white font-bold text-sm">{user.full_name}</h4>
                                <p className="text-xs text-zinc-500 truncate">Click to start conversation</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- CHAT WINDOW --- */}
            <div className="flex-1 flex flex-col bg-[#0b141a]">
                {selectedUser ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-5 border-b border-zinc-800 bg-[#111b21] flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center text-red-500 font-black">
                                    <User size={20} />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold">{selectedUser.full_name}</h3>
                                    <span className="text-[10px] text-green-500 uppercase font-black tracking-widest animate-pulse">Online</span>
                                </div>
                            </div>
                            <MoreVertical className="text-zinc-500 cursor-pointer" />
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat opacity-90">
                            {messages.map((msg, idx) => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={idx} 
                                    className={`flex ${msg.sender_id === adminId ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[70%] p-4 rounded-3xl text-sm font-medium shadow-lg ${msg.sender_id === adminId ? 'bg-red-600 text-white rounded-tr-none' : 'bg-zinc-800 text-zinc-200 rounded-tl-none'}`}>
                                        {msg.message}
                                        <div className="flex justify-end items-center gap-1 mt-1">
                                            <span className="text-[9px] opacity-70">
                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            {msg.sender_id === adminId && <CheckCheck size={12} className="opacity-70" />}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            <div ref={scrollRef} />
                        </div>

                        {/* Message Input */}
                        <form onSubmit={sendMessage} className="p-6 bg-[#111b21] flex items-center gap-4 border-t border-zinc-800 relative">
                            {showEmoji && (
                                <div className="absolute bottom-24 left-6 z-50">
                                    <EmojiPicker theme="dark" onEmojiClick={onEmojiClick} />
                                </div>
                            )}
                            <button type="button" onClick={() => setShowEmoji(!showEmoji)} className="text-zinc-400 hover:text-red-500 transition-colors">
                                <Smile size={24} />
                            </button>
                            <input 
                                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-6 outline-none focus:border-red-600 text-white font-medium"
                                placeholder="Type your message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <button type="submit" className="bg-red-600 p-4 rounded-2xl text-white hover:bg-white hover:text-red-600 transition-all shadow-lg">
                                <Send size={20} />
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 italic">
                        <div className="w-32 h-32 bg-zinc-900 rounded-full flex items-center justify-center mb-6">
                             <Send size={48} className="opacity-20 rotate-12" />
                        </div>
                        <p className="text-lg font-bold uppercase tracking-widest">Select a candidate to start</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inbox;