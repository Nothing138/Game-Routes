import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowUpRight, Globe2, Loader2 } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

const ServiceArea = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Data from Backend
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/visa-countries');
        // Shudhu active country gulo filter kore nite paren
        const activeCountries = res.data.filter(c => c.status === 'active');
        setCountries(activeCountries);
      } catch (err) {
        console.error("Error fetching countries:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);

  // 2. Helper to get Flag (Automated)
  // Eita Country Name k use kore dynamic flag URL generate korbe
  const getFlagUrl = (countryName) => {
    // Normalization: "United States" -> "us"
    const nameMap = {
      "United States": "us",
      "United Kingdom": "gb",
      "Germany": "de",
      "Netherlands": "nl",
      "Italy": "it",
      "Poland": "pl",
      "Canada": "ca",
      "Australia": "au",
      "Saudi Arabia": "sa",
      "UAE": "ae"
    };
    const code = nameMap[countryName] || "un"; // Default to UN flag if not found
    return `https://flagcdn.com/w320/${code.toLowerCase()}.png`;
  };

  if (loading) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <section className="py-24 bg-slate-50 dark:bg-[#050505] relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 dark:bg-red-900/10 text-red-600 text-xs font-black uppercase tracking-[0.3em] mb-4"
          >
            <Globe2 size={14} /> Live Destinations
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
            Services for <span className="text-blue-600">Available Countries</span>
          </h2>
          <div className="w-24 h-1.5 bg-red-600 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* 🔄 Swiper Carousel Connected to Backend */}
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          loop={countries.length > 4} // Loop shudhu tokhon-i hobe jodi 4 tar beshi thake
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true, dynamicBullets: true }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 4 },
          }}
          className="pb-16"
        >
          {countries.map((item) => (
            <SwiperSlide key={item.id}>
              <motion.div
                whileHover={{ y: -10 }}
                className="group relative bg-white dark:bg-zinc-900/50 backdrop-blur-sm border border-slate-200 dark:border-white/5 p-8 rounded-[2.5rem] shadow-xl h-full transition-all duration-500"
              >
                {/* 🎌 Automatic Flag Rendering */}
                <div className="relative w-24 h-24 mx-auto mb-8">
                  <div className="absolute inset-0 bg-blue-600/20 blur-2xl rounded-full" />
                  <img 
                    src={item.image_url ? `http://localhost:5000${item.image_url}` : getFlagUrl(item.country_name)} 
                    alt={item.country_name} 
                    className="relative w-full h-full object-cover rounded-full border-4 border-white dark:border-zinc-800 shadow-lg"
                  />
                </div>

                <div className="text-center space-y-4">
                  <span className="text-red-600 font-bold uppercase text-[10px] tracking-widest italic">
                    {item.category_name || "Immigration"}
                  </span>
                  <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase italic leading-tight">
                    {item.country_name}
                  </h3>
                  
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent my-4" />

                  <div className="flex flex-col items-center gap-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Consultancy Fee</p>
                    <p className="text-lg font-black text-blue-600 italic">৳ {item.application_charge}</p>
                  </div>

                  <button className="mt-6 w-full py-3 rounded-2xl border border-slate-200 dark:border-white/5 text-[10px] font-black uppercase tracking-widest group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 flex items-center justify-center gap-2">
                    View Details <ArrowUpRight size={14}/>
                  </button>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx global>{`
        .swiper-pagination-bullet-active { background: #2563eb !important; width: 20px !important; border-radius: 5px !important; }
      `}</style>
    </section>
  );
};

export default ServiceArea;