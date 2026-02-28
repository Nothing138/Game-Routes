import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay, Pagination } from 'swiper/modules';
import { MapPin, Zap, ArrowUpRight, Star } from 'lucide-react';

// Swiper Styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

const TopSuggestions = () => {
  const [offers, setOffers] = useState([]);

  // 🌐 BACKEND FETCH LOGIC
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        // Apnar API link eikhane hobe: const response = await fetch('/api/suggestions');
        // Ekhonkar jonno dummy data jeta backend theke ashar moto structure
        const data = [
          { id: 1, title: 'Poland Work Permit', location: 'Europe', type: 'Full-Time', offer: '98% Success', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c' },
          { id: 2, title: 'Canada PR', location: 'North America', type: 'Express Entry', offer: 'Hot Deal', img: 'https://images.unsplash.com/photo-1517935703635-2717063c2225' },
          { id: 3, title: 'Romania Job', location: 'Europe', type: 'Construction', offer: 'Instant', img: 'https://images.unsplash.com/photo-1552046122-03184de85e08' },
          { id: 4, title: 'Portugal D7', location: 'Europe', type: 'Passive Income', offer: 'Trending', img: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b' },
        ];
        setOffers(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchOffers();
  }, []);

  return (
    <section className="py-24 bg-[#020202] relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px]" />
      
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.span className="text-blue-500 font-black uppercase tracking-[0.5em] text-[10px]">Premium Opportunities</motion.span>
          <h2 className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter">BOMB <span className="text-blue-600">OFFERS</span></h2>
        </div>

        {/* 🚀 3D COVERFLOW SLIDER */}
        <Swiper
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={'auto'}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          coverflowEffect={{
            rotate: 30,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={{ clickable: true }}
          modules={[EffectCoverflow, Autoplay, Pagination]}
          className="w-full py-12"
        >
          {offers.map((item) => (
            <SwiperSlide key={item.id} className="w-[300px] md:w-[450px] h-[550px] relative rounded-[3rem] overflow-hidden border border-white/10 group bg-zinc-900">
              {/* Card Content */}
              <div className="absolute inset-0 z-20 p-8 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="px-4 py-2 bg-black/50 backdrop-blur-xl rounded-2xl border border-white/10 flex items-center gap-2">
                    <Zap size={14} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">{item.offer}</span>
                  </div>
                  <motion.button whileHover={{ scale: 1.1 }} className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-600/40">
                    <ArrowUpRight size={20} />
                  </motion.button>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-blue-400 mb-2 font-bold uppercase tracking-widest text-[10px]">
                    <MapPin size={14} /> {item.location}
                  </div>
                  <h3 className="text-3xl font-black text-white uppercase italic leading-none mb-3 group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">{item.type}</p>
                </div>
              </div>

              {/* Image with 3D Parallax effect on hover */}
              <img 
                src={`${item.img}?auto=format&fit=crop&w=800&q=80`} 
                alt={item.title} 
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Marquee Loop Niche */}
        <div className="mt-20 border-y border-white/5 py-8 overflow-hidden">
            <div className="flex animate-marquee gap-12 whitespace-nowrap">
                {Array(4).fill(offers).flat().map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                        <Star className="text-blue-600 fill-blue-600" size={14} />
                        <span className="text-xl font-black text-white/10 uppercase italic">{item.title}</span>
                    </div>
                ))}
            </div>
        </div>
      </div>

      <style>{`
        .swiper-pagination-bullet { background: #3b82f6 !important; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 40s linear infinite; }
      `}</style>
    </section>
  );
};

export default TopSuggestions;