import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Calendar, Star, Compass, 
  ArrowRight, Heart, Globe, 
  Waves, Mountain, Utensils, Camera, 
  ShieldCheck, Sparkles, Users
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const Travel = () => {
  const [hoveredId, setHoveredId] = useState(null);

  const packages = [
    {
      id: 1,
      title: "Santorini Dream Escape",
      location: "Greece",
      price: "$1,299",
      duration: "7 Days / 6 Nights",
      rating: 4.9,
      category: "Luxury Beach",
      image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80",
      tags: ["Flight", "Private Villa", "Breakfast"]
    },
    {
      id: 2,
      title: "Swiss Alps Adventure",
      location: "Switzerland",
      price: "$1,850",
      duration: "5 Days / 4 Nights",
      rating: 5.0,
      category: "Mountain Retreat",
      image: "https://images.unsplash.com/photo-1531310197839-ccf54634509e?auto=format&fit=crop&q=80",
      tags: ["Guided Tour", "Skiing", "Resort"]
    },
    {
      id: 3,
      title: "Paris Romance Tour",
      location: "France",
      price: "$999",
      duration: "4 Days / 3 Nights",
      rating: 4.8,
      category: "City Lights",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80",
      tags: ["Dinner Cruise", "Luxury Stay", "Museum"]
    },
    {
      id: 4,
      title: "Bali Tropical Paradise",
      location: "Indonesia",
      price: "$750",
      duration: "10 Days / 9 Nights",
      rating: 4.7,
      category: "Tropical Zen",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80",
      tags: ["Private Pool", "Spa", "Surfing"]
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white dark:bg-slate-950 font-sans">
        
        {/* 🏔️ CINEMATIC HERO SECTION */}
        <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80" 
              className="w-full h-full object-cover scale-105"
              alt="Hero Travel"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-white dark:to-slate-950" />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 text-center px-6"
          >
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white text-[10px] font-black uppercase tracking-[0.3em] mb-8">
              <Sparkles size={14} className="text-yellow-400" /> Premium Experiences 2024
            </div>
            <h1 className="text-7xl lg:text-[10rem] font-black text-white uppercase italic tracking-tighter leading-[0.85] mb-8">
              Beyond <br /> <span className="text-transparent border-t-2 border-b-2 border-white py-2">Horizons</span>
            </h1>
            <p className="text-white/80 text-lg lg:text-xl max-w-2xl mx-auto font-medium mb-10">
              Curating unique journeys for the world's most discerning travelers. Your adventure starts here.
            </p>
            <button className="px-10 py-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-black uppercase tracking-widest transition-all shadow-2xl shadow-emerald-500/20">
              Discover Packages
            </button>
          </motion.div>
        </section>

        {/* 🗺️ FEATURED DESTINATIONS */}
        <section className="py-32 max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-8">
            <div className="space-y-4">
              <h2 className="text-5xl font-black uppercase italic dark:text-white leading-none">
                Featured <br /> <span className="text-emerald-500">Destinations</span>
              </h2>
              <div className="h-2 w-32 bg-emerald-500 rounded-full" />
            </div>
            <p className="text-slate-500 max-w-md font-medium">
              Handpicked by our experts, these locations offer the perfect blend of culture, luxury, and adventure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {packages.map((pkg) => (
              <motion.div
                key={pkg.id}
                onMouseEnter={() => setHoveredId(pkg.id)}
                onMouseLeave={() => setHoveredId(null)}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group relative h-[600px] rounded-[4rem] overflow-hidden shadow-2xl transition-all cursor-none"
              >
                {/* Image & Overlay */}
                <img 
                  src={pkg.image} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110" 
                  alt={pkg.title} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-80" />

                {/* Top Badge */}
                <div className="absolute top-10 left-10 flex items-center gap-3">
                   <div className="px-5 py-2 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                     {pkg.category}
                   </div>
                   <div className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white border border-white/20">
                     <Star size={14} fill="currentColor" className="text-yellow-400" />
                   </div>
                </div>

                {/* Content */}
                <div className="absolute bottom-12 left-12 right-12 text-white">
                  <div className="flex items-center gap-2 text-white/60 mb-4 font-bold uppercase tracking-widest text-[10px]">
                    <MapPin size={14} className="text-emerald-400" /> {pkg.location} — {pkg.duration}
                  </div>
                  <h3 className="text-5xl font-black uppercase italic mb-8 tracking-tighter group-hover:text-emerald-400 transition-colors">
                    {pkg.title}
                  </h3>

                  <div className="flex items-center justify-between border-t border-white/10 pt-8">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-white/40 block mb-1">Starting Price</span>
                      <span className="text-3xl font-black">{pkg.price}</span>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-xl"
                    >
                      <ArrowRight size={24} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 🏆 TRUST & QUALITY SECTION */}
        <section className="bg-slate-900 dark:bg-emerald-950 py-32 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-20 text-white/5 opacity-10">
            <Globe size={400} />
          </div>
          
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-4 gap-12 text-center text-white relative z-10">
            {[
              { icon: <ShieldCheck size={40} />, title: "Secure Booking", desc: "100% Payment Protection" },
              { icon: <Camera size={40} />, title: "Photo Shoots", desc: "Complimentary Travel Snaps" },
              { icon: <Users size={40} />, title: "Expert Guides", desc: "Native Professional Guides" },
              { icon: <Globe size={40} />, title: "Global Reach", desc: "Services in 50+ Countries" }
            ].map((box, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="space-y-4"
              >
                <div className="text-emerald-400 flex justify-center">{box.icon}</div>
                <h4 className="text-lg font-black uppercase italic">{box.title}</h4>
                <p className="text-white/40 text-sm font-medium leading-relaxed">{box.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 📱 CALL TO ACTION SECTION */}
        <section className="py-32 max-w-5xl mx-auto px-6 text-center">
            <div className="p-16 lg:p-24 bg-slate-50 dark:bg-slate-900 rounded-[5rem] border border-slate-100 dark:border-slate-800 space-y-8">
              <h2 className="text-5xl lg:text-7xl font-black uppercase italic tracking-tighter dark:text-white">
                Ready to Plan Your <span className="text-emerald-500">Next Trip?</span>
              </h2>
              <p className="text-slate-500 max-w-xl mx-auto text-lg">
                Join our premium travel club and get exclusive access to hidden gems and member-only discounts.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button className="px-12 py-5 bg-slate-900 dark:bg-emerald-600 text-white rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-all">
                   Contact Travel Expert
                </button>
                <button className="px-12 py-5 border-2 border-slate-200 dark:border-slate-800 dark:text-white rounded-full font-black uppercase tracking-widest text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                   View E-Brochure
                </button>
              </div>
            </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Travel;