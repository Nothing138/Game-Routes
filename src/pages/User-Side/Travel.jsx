import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, Star, ArrowRight, Globe, ShieldCheck, Camera, Users, Sparkles, Loader2
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const Travel = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  // --- API থেকে ডাটা ফেচ করা ---
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/user-travel/packages');
        setPackages(res.data);
      } catch (err) {
        console.error("Failed to load packages", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  // --- বুকিং বা অ্যাপ্লাই ফাংশন ---
  const handleBooking = async (pkgId) => {
    if (!user) {
      Swal.fire({
        title: 'Login Required',
        text: 'Please login to book this premium package.',
        icon: 'warning',
        confirmButtonText: 'Login Now',
        confirmButtonColor: '#10b981',
      }).then((result) => {
        if (result.isConfirmed) navigate('/login');
      });
      return;
    }

    // সাকসেস মেসেজ দেখিয়ে তারপর রিডাইরেক্ট করা
    Swal.fire({
      title: 'Proceed to Application?',
      text: "You are about to apply for this premium tour.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Apply!'
    }).then((result) => {
      if (result.isConfirmed) {
        // এখানে আপনি চাইলে সরাসরি ডাটাবেসে হিট করতে পারেন অথবা ফর্ম পেজে পাঠাতে পারেন
        navigate(`/apply-tours/${pkgId}`);
      }
    });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white dark:bg-[#020617] font-sans">
        
        {/* 🏔️ HERO SECTION (Same as your UI) */}
        <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80" 
              className="w-full h-full object-cover scale-105" alt="Hero"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-white dark:to-[#020617]" />
          </div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 text-center px-6">
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white text-[10px] font-black uppercase tracking-[0.3em] mb-8">
              <Sparkles size={14} className="text-yellow-400" /> Premium Experiences 2026
            </div>
            <h1 className="text-7xl lg:text-[10rem] font-black text-white uppercase italic tracking-tighter leading-[0.85] mb-8">
              Beyond <br /> <span className="text-transparent border-t-2 border-b-2 border-white py-2 px-4">Horizons</span>
            </h1>
            <p className="text-white/80 text-lg lg:text-xl max-w-2xl mx-auto font-medium mb-10 italic">
              Explore the world's most elite destinations with JM IT Group.
            </p>
          </motion.div>
        </section>

        {/* 🗺️ DYNAMIC PACKAGES SECTION */}
        <section className="py-32 max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-8">
            <div className="space-y-4">
              <h2 className="text-5xl font-black uppercase italic dark:text-white leading-none">
                Exclusive <br /> <span className="text-emerald-500">Packages</span>
              </h2>
              <div className="h-2 w-32 bg-emerald-500 rounded-full" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 max-w-md font-medium">
              Real-time available destinations from our global database.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-500" size={48} /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <AnimatePresence>
                {packages.map((pkg) => (
                  <motion.div
                    key={pkg.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="group relative h-[600px] rounded-[4rem] overflow-hidden shadow-2xl transition-all"
                  >
                    {/* ডাটাবেস থেকে ইমেজ, যদি না থাকে তবে ডিফল্ট ইমেজ */}
                    <img 
                      src={pkg.image_url || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80"} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110" 
                      alt={pkg.title} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />

                    {/* Top Badge */}
                    <div className="absolute top-10 left-10 flex items-center gap-3">
                       <div className="px-5 py-2 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                         {pkg.duration}
                       </div>
                       {pkg.is_top === 1 && (
                         <div className="p-3 bg-yellow-500 rounded-full text-white shadow-lg">
                           <Star size={14} fill="currentColor" />
                         </div>
                       )}
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-12 left-12 right-12 text-white">
                      <div className="flex items-center gap-2 text-white/70 mb-4 font-bold uppercase tracking-widest text-[10px]">
                        <MapPin size={14} className="text-emerald-400" /> {pkg.destination}
                      </div>
                      <h3 className="text-5xl font-black uppercase italic mb-8 tracking-tighter group-hover:text-emerald-400 transition-colors leading-tight">
                        {pkg.title}
                      </h3>

                      <div className="flex items-center justify-between border-t border-white/20 pt-8">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-white/40 block mb-1">Package Price</span>
                          <span className="text-3xl font-black text-emerald-400">${pkg.price}</span>
                        </div>
                        <button 
                          onClick={() => handleBooking(pkg.id)}
                          className="px-8 py-4 bg-white text-black rounded-full font-black uppercase tracking-tighter text-xs hover:bg-emerald-500 hover:text-white transition-all shadow-xl flex items-center gap-2"
                        >
                          Apply Now <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>

        {/* 🏆 Features (Same as your UI but Dark Mode Ready) */}
        <section className="bg-slate-900 dark:bg-emerald-950/30 py-32 overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-4 gap-12 text-center text-white">
            {[
              { icon: <ShieldCheck size={40} />, title: "Secure Booking", desc: "100% Payment Protection" },
              { icon: <Camera size={40} />, title: "Photo Shoots", desc: "Complimentary Travel Snaps" },
              { icon: <Users size={40} />, title: "Expert Guides", desc: "Native Professional Guides" },
              { icon: <Globe size={40} />, title: "Global Reach", desc: "Services in 50+ Countries" }
            ].map((box, i) => (
              <div key={i} className="space-y-4">
                <div className="text-emerald-400 flex justify-center">{box.icon}</div>
                <h4 className="text-lg font-black uppercase italic">{box.title}</h4>
                <p className="text-white/40 text-sm font-medium">{box.desc}</p>
              </div>
            ))}
          </div>
        </section>


      </div>
    </>
  );
};

export default Travel;