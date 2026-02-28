import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { ArrowRight, MapPin, CheckCircle2, Star, Globe, Plane, Zap } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const TopSuggestions = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Visa');

  useEffect(() => {
    const fetchTopOffers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/visa-countries/top');
        setOffers(response.data || []);
        setLoading(false);
      } catch (error) {
        console.error("API Fetch Error:", error);
        setLoading(false);
      }
    };
    fetchTopOffers();
  }, []);

  // Filter Logic: useMemo use korle bar bar loading hobe na, calculation fast hobe
  const filteredOffers = useMemo(() => {
    if (offers.length === 0) return [];
    const filtered = offers.filter(item => 
      item.type?.toLowerCase() === activeTab.toLowerCase() || 
      item.category_name?.toLowerCase().includes(activeTab.toLowerCase())
    );
    // Safety check: Filter e kichu na peleo jate empty na thake (Visa-r jonno fallback)
    return filtered.length > 0 ? filtered : (activeTab === 'Visa' ? offers : []);
  }, [offers, activeTab]);

  const SkeletonCard = () => (
    <div className="bg-slate-50 dark:bg-zinc-900/50 rounded-[2.5rem] p-4 h-[450px] animate-pulse border border-slate-100 dark:border-zinc-800">
      <div className="w-full h-64 bg-slate-200 dark:bg-zinc-800 rounded-[2rem] mb-4" />
      <div className="h-6 w-1/2 bg-slate-200 dark:bg-zinc-800 rounded mb-4" />
      <div className="h-4 w-3/4 bg-slate-200 dark:bg-zinc-800 rounded mb-2" />
      <div className="h-4 w-1/4 bg-slate-200 dark:bg-zinc-800 rounded" />
    </div>
  );

  return (
    <section className="py-24 bg-white dark:bg-[#060606] transition-colors duration-500 relative overflow-hidden">
      
      {/* Dynamic Background Accents */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-20 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-center md:text-left"
          >
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
               <span className="px-3 py-1 bg-blue-600/10 text-blue-600 text-xs font-bold rounded-full uppercase tracking-tighter">Premium Choices</span>
               <Zap size={14} className="text-yellow-500 fill-yellow-500" />
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
              Top <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-400">Suggestions</span>
            </h2>
            <p className="text-slate-500 dark:text-zinc-400 text-lg max-w-md font-medium">
              Explore our most successful {activeTab} deals curated by experts.
            </p>
          </motion.div>

          {/* 🛠️ Ultra Modern Tab Switcher */}
          <div className="flex items-center p-2 bg-slate-100/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[2rem] border border-slate-200 dark:border-zinc-800 shadow-2xl shadow-blue-500/5">
            {['Visa', 'Travel'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative flex items-center gap-3 px-8 py-3.5 rounded-[1.5rem] text-sm font-bold transition-all duration-500 ${
                  activeTab === tab 
                    ? 'text-white' 
                    : 'text-slate-500 dark:text-zinc-500 hover:text-blue-600'
                }`}
              >
                {activeTab === tab && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[1.5rem] shadow-lg shadow-blue-600/30"
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                   {tab === 'Visa' ? <Globe size={18} /> : <Plane size={18} />} {tab}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 🚀 Main Display Area */}
        <div className="relative min-h-[500px]">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <SkeletonCard /> <SkeletonCard /> <SkeletonCard />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab} // Tab change e full reset hobe na, smoothly transition hobe
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.4, ease: "circOut" }}
              >
                {filteredOffers.length > 0 ? (
                  <Swiper
                    modules={[Autoplay, Pagination, Navigation]}
                    spaceBetween={32}
                    slidesPerView={1}
                    autoplay={{ delay: 6000, disableOnInteraction: false }}
                    breakpoints={{
                      640: { slidesPerView: 2 },
                      1024: { slidesPerView: 3 },
                    }}
                    pagination={{ clickable: true, el: '.custom-pagination' }}
                    className="!pb-20 !overflow-visible"
                  >
                    {filteredOffers.map((item) => (
                      <SwiperSlide key={item.id}>
                        <div className="group bg-white dark:bg-zinc-900/30 backdrop-blur-md rounded-[3rem] border border-slate-100 dark:border-zinc-800/80 p-4 hover:border-blue-500/40 hover:shadow-3xl hover:shadow-blue-500/10 transition-all duration-700 h-full flex flex-col">
                          
                          {/* Image with Advanced Overlay */}
                          <div className="relative h-80 overflow-hidden rounded-[2.5rem]">
                            <img 
                              src={item.image_url ? `http://localhost:5000${item.image_url}` : 'https://via.placeholder.com/400x300'} 
                              alt={item.country_name} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-in-out"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            
                            <div className="absolute top-5 left-5 flex gap-2">
                              <span className="px-5 py-2 bg-white/20 dark:bg-black/40 backdrop-blur-xl border border-white/30 text-white text-[11px] font-bold uppercase rounded-full tracking-widest">
                                {item.category_name || activeTab}
                              </span>
                            </div>
                          </div>

                          {/* Content Section */}
                          <div className="p-6 flex-grow flex flex-col">
                            <div className="flex justify-between items-start mb-6">
                              <div>
                                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-[10px] mb-2 uppercase font-black tracking-widest">
                                    <MapPin size={12} /> {item.country_name}
                                </div>
                                <h3 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">
                                  {item.country_name}
                                </h3>
                              </div>
                              <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-2xl group-hover:bg-blue-600 transition-colors duration-500">
                                <Star size={20} className="text-blue-600 dark:text-blue-400 group-hover:text-white" fill="currentColor" />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-8">
                                <div className="flex items-center gap-2 bg-slate-50 dark:bg-zinc-800/50 p-3 rounded-2xl border border-slate-100 dark:border-zinc-700/50">
                                    <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                                    <span className="text-[11px] font-bold text-slate-600 dark:text-zinc-400">99% Success</span>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-50 dark:bg-zinc-800/50 p-3 rounded-2xl border border-slate-100 dark:border-zinc-700/50">
                                    <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                                    <span className="text-[11px] font-bold text-slate-600 dark:text-zinc-400">Fast Process</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-zinc-800 mt-auto">
                              <div>
                                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Total Budget</p>
                                <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">${item.application_charge}</p>
                              </div>
                              <button className="bg-slate-900 dark:bg-white text-white dark:text-black px-6 py-4 rounded-3xl hover:bg-blue-600 dark:hover:bg-blue-400 hover:text-white transition-all duration-500 flex items-center gap-3 group/btn shadow-xl shadow-black/5">
                                <span className="font-bold text-sm">Details</span>
                                <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : (
                  <div className="h-80 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 dark:border-zinc-800 rounded-[3rem]">
                    <Globe size={48} className="text-slate-200 mb-4 animate-bounce" />
                    <p className="text-slate-400 font-bold">No active deals found for {activeTab}</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Custom Pagination Style */}
        <div className="custom-pagination flex justify-center gap-3" />

      </div>

      <style>{`
        .custom-pagination .swiper-pagination-bullet { background: #cbd5e1; width: 10px; height: 10px; transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); opacity: 1; border-radius: 5px; }
        .dark .custom-pagination .swiper-pagination-bullet { background: #1f2937; }
        .custom-pagination .swiper-pagination-bullet-active { background: #2563eb !important; width: 45px; }
      `}</style>
    </section>
  );
};

export default TopSuggestions;