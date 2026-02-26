import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Send, Image as ImageIcon, Type, AlignLeft, Sparkles, Eye, CheckCircle2 } from 'lucide-react';

const UploadBlog = () => {
    const [formData, setFormData] = useState({ 
        title: '', 
        content: '', 
        featured_image: '',
        author_id: 1 
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/admin/blogs', formData);
            if(res.data.success) {
                Swal.fire({
                    title: '<span class="font-black italic uppercase">Story Deployed!</span>',
                    text: 'Your article has been broadcasted to the world.',
                    icon: 'success',
                    background: '#fff',
                    confirmButtonColor: '#000',
                    confirmButtonText: 'AWESOME',
                    customClass: { popup: 'rounded-[40px] border-4 border-black' }
                });
                setFormData({ title: '', content: '', featured_image: '', author_id: 1 });
            }
        } catch (err) {
            Swal.fire('Error', 'Failed to publish blog', 'error');
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-10 space-y-12">
            {/* Header Section */}
            <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-[3px] mb-2 animate-bounce">
                    <Sparkles size={14}/> Creator Mode
                </div>
                <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">
                    Write Your <span className="text-red-600 underline decoration-black underline-offset-8">BLOG</span>
                </h2>
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest pt-2">Craft stories that move the industry</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* Form Section */}
                <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white p-6 md:p-12 rounded-[50px] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.1)] border border-gray-100 space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
                    
                    {/* Title Input */}
                    <div className="space-y-3 relative">
                        <label className="text-[10px] font-black uppercase text-gray-500 ml-5 flex items-center gap-2 tracking-tighter">
                            <Type size={14} className="text-red-600"/> Catchy Headline
                        </label>
                        <input 
                            placeholder="Enter a killer title..." 
                            className="w-full p-6 bg-slate-50 border-2 border-transparent rounded-[30px] font-black text-lg outline-none focus:border-black focus:bg-white transition-all duration-500 placeholder:text-gray-300"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            required
                        />
                    </div>

                    {/* Image URL Input */}
                    <div className="space-y-3 relative">
                        <label className="text-[10px] font-black uppercase text-gray-500 ml-5 flex items-center gap-2 tracking-tighter">
                            <ImageIcon size={14} className="text-blue-600"/> Thumbnail Link (CDN/Web)
                        </label>
                        <input 
                            placeholder="https://images.unsplash.com/..." 
                            className="w-full p-6 bg-slate-50 border-2 border-transparent rounded-[30px] font-bold text-sm outline-none focus:border-black focus:bg-white transition-all duration-500"
                            value={formData.featured_image}
                            onChange={(e) => setFormData({...formData, featured_image: e.target.value})}
                        />
                    </div>

                    {/* Content Input */}
                    <div className="space-y-3 relative">
                        <label className="text-[10px] font-black uppercase text-gray-500 ml-5 flex items-center gap-2 tracking-tighter">
                            <AlignLeft size={14} className="text-green-600"/> Story Content
                        </label>
                        <textarea 
                            placeholder="Once upon a time in the agency..." 
                            rows="8"
                            className="w-full p-8 bg-slate-50 border-2 border-transparent rounded-[40px] font-bold text-base outline-none focus:border-black focus:bg-white transition-all duration-500 leading-relaxed"
                            value={formData.content}
                            onChange={(e) => setFormData({...formData, content: e.target.value})}
                            required
                        ></textarea>
                    </div>

                    <button type="submit" className="group relative w-full overflow-hidden bg-black text-white p-8 rounded-[30px] font-black uppercase italic tracking-[5px] text-sm transition-all duration-500 hover:scale-[1.02] active:scale-95 shadow-2xl shadow-black/20">
                        <span className="relative z-10 flex items-center justify-center gap-4">
                            <Send size={20} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500"/> Deploy Article
                        </span>
                        <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                    </button>
                </form>

                {/* Live Preview Section (The "Bomb" Part) */}
                <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-10">
                    <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-[5px] ml-4 flex items-center gap-2">
                        <Eye size={14}/> Real-time Preview
                    </h3>
                    
                    <div className="bg-slate-900 rounded-[50px] overflow-hidden shadow-2xl border-[10px] border-slate-800 transform rotate-2 hover:rotate-0 transition-transform duration-700">
                        <div className="h-56 bg-slate-800 relative overflow-hidden group">
                            {formData.featured_image ? (
                                <img src={formData.featured_image} alt="Preview" className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-1000"/>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-slate-600">
                                    <ImageIcon size={48} className="mb-2 opacity-20"/>
                                    <span className="text-[10px] font-black uppercase tracking-widest">Awaiting Media...</span>
                                </div>
                            )}
                            <div className="absolute top-6 left-6 bg-red-600 text-white text-[8px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                                Live Preview
                            </div>
                        </div>
                        
                        <div className="p-8 space-y-4 bg-gradient-to-b from-slate-900 to-black">
                            <h4 className="text-white text-xl font-black italic uppercase leading-tight min-h-[50px]">
                                {formData.title || "Your Headline Will Appear Here..."}
                            </h4>
                            <div className="w-12 h-1 bg-red-600"></div>
                            <p className="text-slate-500 text-xs font-bold leading-relaxed line-clamp-4">
                                {formData.content || "Start typing in the content box to see how your story will be formatted on the main portal..."}
                            </p>
                            <div className="pt-6 flex items-center gap-2">
                                <CheckCircle2 size={16} className={formData.content.length > 50 ? "text-green-500" : "text-slate-700"}/>
                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Quality Check</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-[30px] border border-gray-100 shadow-sm flex items-center justify-between">
                        <div className="text-center flex-1">
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Characters</p>
                            <p className="text-xl font-black italic">{formData.content.length}</p>
                        </div>
                        <div className="w-[1px] h-8 bg-gray-100"></div>
                        <div className="text-center flex-1">
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Status</p>
                            <p className="text-[10px] font-black text-green-500 uppercase italic">Ready</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadBlog;