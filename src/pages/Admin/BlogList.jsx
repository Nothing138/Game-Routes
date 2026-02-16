import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Trash2, Edit3, Eye, Calendar, Search, Sparkles, Zap } from 'lucide-react';

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [search, setSearch] = useState('');

    const fetchBlogs = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/blogs');
            setBlogs(res.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchBlogs(); }, []);

    const handleEdit = (blog) => {
        Swal.fire({
            title: `<span class="italic font-black uppercase text-xl tracking-tighter">Modify <span class="text-red-600">Article</span></span>`,
            html: `
                <div class="text-left space-y-4 p-2">
                    <div>
                        <label class="text-[9px] font-black uppercase text-gray-400 mb-1 block ml-2">Headlines</label>
                        <input id="swal-title" class="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-red-500" value="${blog.title}">
                    </div>
                    <div>
                        <label class="text-[9px] font-black uppercase text-gray-400 mb-1 block ml-2">Thumbnail URL</label>
                        <input id="swal-image" class="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-red-500" value="${blog.featured_image || ''}">
                    </div>
                    <div>
                        <label class="text-[9px] font-black uppercase text-gray-400 mb-1 block ml-2">Body Content</label>
                        <textarea id="swal-content" rows="6" class="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-red-500">${blog.content}</textarea>
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Update Now',
            confirmButtonColor: '#000',
            cancelButtonText: 'Abort',
            customClass: { popup: 'rounded-[30px] md:rounded-[40px] border-4 border-black w-[95%] max-w-lg' },
            preConfirm: () => {
                return {
                    title: document.getElementById('swal-title').value,
                    featured_image: document.getElementById('swal-image').value,
                    content: document.getElementById('swal-content').value
                }
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.put(`http://localhost:5000/api/admin/blogs/${blog.id}`, result.value);
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                    });
                    Toast.fire({ icon: 'success', title: 'Article updated!' });
                    fetchBlogs();
                } catch (err) { Swal.fire('Error', 'Update failed', 'error'); }
            }
        });
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Wipe Record?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            confirmButtonText: 'Delete',
            customClass: { popup: 'rounded-[30px]' }
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.delete(`http://localhost:5000/api/admin/blogs/${id}`);
                fetchBlogs();
                Swal.fire('Deleted!', '', 'success');
            }
        });
    };

    const filteredBlogs = blogs.filter(b => b.title.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6 md:space-y-10 px-2 md:px-0">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter leading-none">Content <span className="text-red-600 underline decoration-black">Vault</span></h2>
                    <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-[2px] md:tracking-[4px] mt-2 flex items-center gap-2">
                        <Sparkles size={12} className="text-yellow-500"/> Inventory: {blogs.length} Posts
                    </p>
                </div>
                
                <div className="relative group w-full lg:w-auto">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-black rounded-2xl blur opacity-20 group-hover:opacity-50 transition duration-1000"></div>
                    <div className="relative flex items-center bg-white rounded-2xl p-1 w-full lg:w-80">
                        <Search className="ml-4 text-gray-400 shrink-0" size={18}/>
                        <input 
                            placeholder="Filter articles..." 
                            className="pl-3 pr-4 py-3 bg-transparent border-none font-black italic uppercase text-[10px] md:text-xs outline-none w-full"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Grid Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-10">
                {filteredBlogs.map(blog => (
                    <div key={blog.id} className="relative group mx-1">
                        {/* Background Decorative Layer - Responsive Offset */}
                        <div className="absolute inset-0 bg-black rounded-[40px] md:rounded-[55px] translate-x-1.5 translate-y-1.5 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500"></div>
                        
                        {/* Main Card */}
                        <div className="relative bg-white border-2 border-black rounded-[35px] md:rounded-[50px] overflow-hidden transition-all duration-500 flex flex-col h-full">
                            <div className="h-48 md:h-60 bg-slate-100 relative overflow-hidden shrink-0">
                                {blog.featured_image ? (
                                    <img src={blog.featured_image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"/>
                                ) : (
                                    <div className="flex items-center justify-center h-full bg-slate-900 text-white font-black italic uppercase text-[10px]">No Image</div>
                                )}
                                <div className="absolute top-4 md:top-6 left-4 md:left-6 flex gap-2">
                                    <span className="bg-black/90 backdrop-blur-md text-white text-[7px] md:text-[8px] px-3 md:px-4 py-1.5 rounded-full font-black uppercase tracking-widest flex items-center gap-1">
                                        <Zap size={10} className="text-yellow-400"/> Admin Post
                                    </span>
                                </div>
                            </div>

                            <div className="p-5 md:p-8 flex flex-col flex-grow">
                                <div className="flex items-center gap-2 text-[8px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">
                                    <Calendar size={10}/> {new Date(blog.created_at).toLocaleDateString()}
                                </div>
                                
                                <h3 className="text-lg md:text-xl font-black italic uppercase text-black leading-tight mb-3 line-clamp-2 group-hover:text-red-600 transition-colors">
                                    {blog.title}
                                </h3>
                                
                                <p className="text-gray-500 text-[10px] md:text-[11px] font-bold leading-relaxed line-clamp-3 mb-6 flex-grow">
                                    {blog.content}
                                </p>
                                
                                <div className="flex items-center justify-between mt-auto">
                                    <div className="flex gap-2 md:gap-3">
                                        <button onClick={() => handleDelete(blog.id)} className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-red-50 text-red-600 rounded-xl md:rounded-2xl hover:bg-red-600 hover:text-white transition-all transform hover:-rotate-6 active:scale-95">
                                            <Trash2 size={16}/>
                                        </button>
                                        <button onClick={() => handleEdit(blog)} className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-slate-900 text-white rounded-xl md:rounded-2xl hover:bg-black transition-all transform hover:rotate-6 active:scale-95">
                                            <Edit3 size={16}/>
                                        </button>
                                    </div>
                                    <button className="text-[9px] md:text-[10px] font-black uppercase italic text-black flex items-center gap-1 hover:underline">
                                        View <Eye size={14}/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredBlogs.length === 0 && (
                <div className="relative p-10 md:p-20 text-center bg-white rounded-[40px] md:rounded-[60px] border-4 border-dashed border-gray-100 mx-1">
                    <p className="font-black italic uppercase text-gray-300 text-lg md:text-2xl tracking-[5px] md:tracking-[10px]">Vault Empty</p>
                </div>
            )}
        </div>
    );
};

export default BlogList;