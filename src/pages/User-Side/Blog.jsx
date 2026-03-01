import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, ArrowRight, Sparkles, Clock, Hash, Zap, ChevronLeft, ChevronRight, Monitor } from 'lucide-react';
import { Link } from 'react-router-dom';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const BlogPage = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                // Corrected endpoint from 'blogis' to 'blogs' based on your previous backend code
                const res = await axios.get('http://localhost:5000/api/admin/blogs');
                setBlogs(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching blogs:", err);
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#050505]">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-red-600/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-red-600 rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-[#050505] min-h-screen text-black dark:text-white selection:bg-red-600 selection:text-white pb-32 transition-colors duration-500">
            
            {/* --- Hero Header --- */}
            <header className="pt-32 pb-16 px-6 relative overflow-hidden">
                {/* Background Glows for Dark Mode */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-600/10 blur-[120px] rounded-full -z-0 pointer-events-none opacity-50 dark:opacity-100"></div>
                
                <div className="max-w-7xl mx-auto text-center space-y-6 relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full text-[10px] font-black uppercase tracking-[4px] text-zinc-500">
                        <Monitor size={12} className="text-red-600"/> Digital Transmissions
                    </div>
                    <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase italic leading-none">
                        The <span className="text-red-600 underline decoration-zinc-200 dark:decoration-zinc-800 underline-offset-8">Blog</span>
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 font-medium text-xs md:text-sm max-w-xl mx-auto tracking-[0.2em] uppercase leading-relaxed">
                        Curating the future of gaming culture & agency intelligence.
                    </p>
                </div>
            </header>

            {/* --- Slider Section --- */}
            <main className="max-w-7xl mx-auto px-6 relative group">
                <Swiper
                    spaceBetween={40}
                    slidesPerView={1}
                    loop={true}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    pagination={{ clickable: true, dynamicBullets: true }}
                    navigation={{
                        nextEl: '.next-btn',
                        prevEl: '.prev-btn',
                    }}
                    breakpoints={{
                        768: { slidesPerView: 2 },
                        1280: { slidesPerView: 3 },
                    }}
                    modules={[Autoplay, Pagination, Navigation]}
                    className="pb-24 !overflow-visible"
                >
                    {blogs.map((blog) => (
                        <SwiperSlide key={blog.id}>
                            <div className="group/card relative bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-[45px] p-1 transition-all duration-700 hover:shadow-[0_40px_100px_-20px_rgba(220,38,38,0.15)] hover:-translate-y-4 hover:border-red-600/50 h-[500px]">
                                
                                <div className="p-10 h-full flex flex-col justify-between relative z-10">
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="w-14 h-14 bg-white dark:bg-zinc-800 rounded-[22px] flex items-center justify-center shadow-sm group-hover/card:bg-red-600 group-hover/card:text-white transition-all duration-500 group-hover/card:rotate-[15deg]">
                                                <Hash size={24} className="text-zinc-400 group-hover/card:text-white transition-colors" />
                                            </div>
                                            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 group-hover/card:border-red-500/30 transition-all">
                                                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-300">Live</span>
                                            </div>
                                        </div>

                                        <h3 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white leading-[1.1] italic uppercase group-hover/card:text-red-600 transition-colors duration-300">
                                            {blog.title}
                                        </h3>

                                        <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed line-clamp-4 font-medium italic">
                                            {blog.content.replace(/<[^>]*>?/gm, '')}
                                        </p>
                                    </div>

                                    <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col gap-6">
                                        <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-tighter text-zinc-400 dark:text-zinc-500">
                                            <span className="flex items-center gap-2"><Calendar size={14} className="text-red-600"/> {new Date(blog.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                                            <span className="flex items-center gap-2"><Clock size={14} className="text-red-600"/> 4 MINS</span>
                                        </div>

                                        <Link 
                                            to={`/blogs/${blog.slug}`}
                                            className="group/btn relative inline-flex items-center justify-between overflow-hidden px-8 py-4 bg-white dark:bg-zinc-800 rounded-2xl transition-all duration-500 hover:bg-red-600"
                                        >
                                            <span className="relative z-10 text-xs font-black uppercase italic tracking-widest text-zinc-900 dark:text-white group-hover/btn:text-white transition-colors">Dive into Story</span>
                                            <ArrowRight size={20} className="relative z-10 text-red-600 group-hover/btn:text-white group-hover/btn:translate-x-2 transition-all duration-500" />
                                        </Link>
                                    </div>
                                </div>
                                
                                {/* Subtle pattern on hover */}
                                <div className="absolute inset-0 opacity-0 group-hover/card:opacity-5 transition-opacity duration-700 pointer-events-none bg-[radial-gradient(#e11d48_1px,transparent_1px)] [background-size:20px_20px] rounded-[45px]"></div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* --- Custom Controls --- */}
                <div className="flex justify-center items-center gap-8 mt-4">
                    <button className="prev-btn w-14 h-14 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400 hover:border-red-600 hover:text-red-600 transition-all active:scale-90">
                        <ChevronLeft size={28} />
                    </button>
                    <button className="next-btn w-14 h-14 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400 hover:border-red-600 hover:text-red-600 transition-all active:scale-90">
                        <ChevronRight size={28} />
                    </button>
                </div>
            </main>

            {/* Custom Styles */}
            <style dangerouslySetInnerHTML={{ __html: `
                .swiper-pagination-bullet { background: #52525b !important; opacity: 0.3; width: 8px; height: 8px; transition: all 0.3s; }
                .swiper-pagination-bullet-active { background: #dc2626 !important; width: 32px !important; border-radius: 4px !important; opacity: 1; }
                .swiper-slide { transition: transform 0.5s ease; opacity: 0.4; }
                .swiper-slide-active { opacity: 1; transform: scale(1.02); }
            `}} />
        </div>
    );
};

export default BlogPage;