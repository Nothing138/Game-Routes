import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectCoverflow } from 'swiper/modules';
import { Quote, Sparkles } from 'lucide-react';

// Swiper Styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

const TestimonialSection = () => {
    const [stories, setStories] = useState([]);

    useEffect(() => {
        // Backend base URL ta ekta variable e rakha bhalo
        const API_BASE = "http://localhost:5000";
        axios.get(`${API_BASE}/api/testimonials`)
            .then(res => setStories(res.data))
            .catch(err => console.log("Testimonial Fetch Error:", err));
    }, []);

    return (
        <section className="py-32 bg-[#fafafa] dark:bg-[#050505] relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/10 text-blue-600 text-[10px] font-black uppercase tracking-[0.4em] mb-4">
                        <Sparkles size={12} /> Trusted by Thousands
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
                        Success <span className="text-blue-600">Stories</span>
                    </h2>
                    <div className="w-20 h-1.5 bg-red-600 mx-auto mt-6" />
                </div>

                <Swiper
                    modules={[Autoplay, Pagination, EffectCoverflow]}
                    effect={'coverflow'}
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView={1}
                    loop={true}
                    coverflowEffect={{
                        rotate: 0,
                        stretch: 0,
                        depth: 100,
                        modifier: 2.5,
                        slideShadows: false,
                    }}
                    autoplay={{ delay: 4000 }}
                    pagination={{ clickable: true, dynamicBullets: true }}
                    breakpoints={{
                        1024: { slidesPerView: 3 }
                    }}
                    className="pb-20 testimonial-swiper"
                >
                    {stories.map((item) => (
                        <SwiperSlide key={item.id} className="p-4">
                            <div className="group bg-white dark:bg-zinc-900/40 backdrop-blur-md p-10 rounded-[3.5rem] border border-slate-200 dark:border-white/5 relative shadow-2xl shadow-slate-200/50 dark:shadow-none transition-all duration-500 hover:border-blue-500/50">
                                
                                {/* Large Quote Icon */}
                                <Quote className="absolute top-8 right-10 text-slate-100 dark:text-white/5 group-hover:text-blue-600/10 transition-colors duration-500" size={80} />
                                
                                <div className="relative z-10">
                                    <div className="flex items-center gap-5 mb-8">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-blue-600 blur-lg opacity-20 group-hover:opacity-40 rounded-full transition-opacity" />
                                            <img 
                                                src={`http://localhost:5000${item.image_url}`} 
                                                alt={item.name} 
                                                className="w-20 h-20 rounded-[2rem] object-cover border-4 border-white dark:border-zinc-800 relative z-10 grayscale group-hover:grayscale-0 transition-all duration-500"
                                            />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-xl text-slate-900 dark:text-white uppercase italic leading-none">{item.name}</h4>
                                            <p className="text-blue-600 text-xs font-bold uppercase mt-2 tracking-widest">{item.designation}</p>
                                        </div>
                                    </div>
                                    
                                    <p className="text-slate-600 dark:text-zinc-400 text-lg leading-relaxed font-medium italic">
                                        "{item.description}"
                                    </p>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <style jsx global>{`
                .testimonial-swiper .swiper-pagination-bullet-active {
                    background: #2563eb !important;
                    width: 30px !important;
                    border-radius: 4px !important;
                }
            `}</style>
        </section>
    );
};

export default TestimonialSection;