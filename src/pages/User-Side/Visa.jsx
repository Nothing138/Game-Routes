import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Swal from 'sweetalert2';
import { 
  PlaneTakeoff, Search, Clock, CheckCircle2, ArrowRight, 
  Globe2, ShieldCheck, GraduationCap, Tractor, Briefcase, 
  Shovel, Loader2, Sparkles, FilterX, MapPin, MousePointer2
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const Visa = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [visaCards, setVisaCards] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisaData = async () => {
      try {
        setLoading(true);
        const [visaRes, catRes] = await Promise.all([
          axios.get('http://localhost:5000/api/visas'),
          axios.get('http://localhost:5000/api/visas/categories')
        ]);
        setVisaCards(visaRes.data);
        setCategories(catRes.data);
      } catch (error) {
        console.error("Error fetching visa data:", error);
        Swal.fire('Error', 'Failed to load visa data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchVisaData();
  }, []);

  const handleApply = (visaId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire({
        title: 'Authentication Required',
        text: 'Please login to your account to process this application.',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Login Now',
        confirmButtonColor: '#2563eb'
      }).then((res) => res.isConfirmed && navigate('/login'));
    } else {
      navigate(`/apply-visa/${visaId}`);
    }
  };

  const getCategoryIcon = (name) => {
    switch (name?.toLowerCase()) {
      case 'agriculture': return <Tractor size={28} />;
      case 'student': return <GraduationCap size={28} />;
      case 'working': return <Briefcase size={28} />;
      case 'laboure': return <Shovel size={28} />;
      default: return <PlaneTakeoff size={28} />;
    }
  };

  // Logic for Filtering
  const filteredVisas = visaCards.filter(v => {
    const matchesSearch = v.country_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || v.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white dark:bg-slate-950">
      <Loader2 className="animate-spin text-blue-600" size={48} />
    </div>
  );

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen font-sans selection:bg-blue-100 selection:text-blue-600">
      <Navbar />
      
      {/* 🚀 1. HERO & INTRO */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto space-y-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600/10 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest">
              <Sparkles size={14} /> World Class Immigration Portal
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-tight uppercase tracking-tighter italic">
              Find Your <span className="text-blue-600">Future</span> Abroad.
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">
              Explore thousands of visa opportunities. From student pathways to skilled migration, we simplify your journey to a new life.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto mt-10">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Search by country (e.g. Poland, Romania)..."
                className="w-full pl-16 pr-6 py-5 bg-white dark:bg-slate-900 shadow-2xl shadow-blue-500/10 rounded-2xl outline-none border-2 border-transparent focus:border-blue-600 transition-all dark:text-white"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 📦 2. HOW IT WORKS */}
      <section className="py-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { icon: <MousePointer2 className="text-blue-600"/>, t: "Pick Category", d: "Select your preferred visa type below." },
            { icon: <Globe2 className="text-purple-600"/>, t: "Choose Country", d: "Browse available active visa routes." },
            { icon: <CheckCircle2 className="text-green-600"/>, t: "Apply Online", d: "Submit details and track status live." }
          ].map((step, i) => (
            <div key={i} className="p-6 rounded-3xl bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-slate-800">
              <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl shadow-lg flex items-center justify-center mx-auto mb-4">{step.icon}</div>
              <h4 className="font-black uppercase text-xs dark:text-white italic">{step.t}</h4>
              <p className="text-xs text-slate-500 mt-1 font-bold">{step.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🏷️ 3. CATEGORY FILTERING */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10 border-b dark:border-slate-800 pb-6">
          <div>
            <h2 className="text-2xl font-black uppercase italic dark:text-white tracking-tighter">Visa Categories</h2>
            <p className="text-xs font-bold text-slate-400 uppercase">Click to filter available routes</p>
          </div>
          <button 
            onClick={() => setSelectedCategory('All')}
            className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategory === 'All' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 dark:text-white'}`}
          >
            Show All
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat, i) => (
            <motion.button 
              key={i}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(cat.title)}
              className={`p-6 rounded-[2rem] border-2 transition-all text-center flex flex-col items-center gap-3 ${selectedCategory === cat.title ? 'border-blue-600 bg-blue-600/5 shadow-xl shadow-blue-500/10' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm'}`}
            >
              <div className={`p-4 rounded-2xl ${selectedCategory === cat.title ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                {getCategoryIcon(cat.title)}
              </div>
              <div>
                <h3 className="text-xs font-black uppercase italic dark:text-white">{cat.title}</h3>
                <p className="text-[10px] font-bold text-blue-600">{cat.count} Routes</p>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* 📊 4. DYNAMIC VISA CARDS */}
      <section className="pb-32 px-6 max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
           <h2 className="text-3xl font-black uppercase italic dark:text-white tracking-tighter">
             {selectedCategory} <span className="text-blue-600">Opportunities</span>
           </h2>
           <p className="text-xs font-bold text-slate-400 uppercase">{filteredVisas.length} Countries Found</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence mode='popLayout'>
            {filteredVisas.length > 0 ? filteredVisas.map((visa) => (
              <motion.div
                layout
                key={visa.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`relative group rounded-[3rem] p-[2px] overflow-hidden ${visa.is_top ? 'bg-gradient-to-r from-red-600 via-orange-500 to-red-600 bg-[length:200%_auto] animate-gradient-xy shadow-2xl shadow-red-500/20' : 'bg-slate-200 dark:bg-slate-800'}`}
              >
                {/* Red Line Rotating Animation logic inside the p-[2px] wrapper */}
                <div className="bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden h-full flex flex-col">
                  
                  {/* Image & Overlay */}
                  <div className="h-64 relative overflow-hidden">
                    <img 
                      src={visa.image_url ? `http://localhost:5000${visa.image_url}` : "https://via.placeholder.com/400"} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700 brightness-90 group-hover:brightness-100" 
                      alt={visa.country_name} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent" />
                    
                    {visa.is_top && (
                      <div className="absolute top-6 right-6 bg-red-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full animate-pulse shadow-lg flex items-center gap-2">
                        🔥 HOT OPPORTUNITY
                      </div>
                    )}

                    <div className="absolute bottom-6 left-8 flex items-center gap-3">
                      <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl"><MapPin className="text-white" size={20}/></div>
                      <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">{visa.country_name}</h3>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-8 space-y-6 flex-grow">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full border border-blue-100 dark:border-blue-800">
                        {visa.type} Visa
                      </span>
                      <div className="flex items-center gap-1 text-slate-400">
                        <Clock size={14}/> <span className="text-[10px] font-bold uppercase">{visa.process_time}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Visa Duration</p>
                        <p className="text-xs font-black dark:text-white uppercase">{visa.duration}</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Success Rate</p>
                        <p className="text-xs font-black text-green-600 uppercase italic">98% Verified</p>
                      </div>
                    </div>

                    <div className="pt-6 border-t dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase">Consultancy Fee</p>
                        <p className="text-3xl font-black text-blue-600 tracking-tighter">
                          {new Intl.NumberFormat('en-US', { 
                            style: 'currency', 
                            currency: 'USD',
                            maximumFractionDigits: 0 
                          }).format(visa.application_charge)}
                        </p>
                      </div>
                      <button 
                        onClick={() => handleApply(visa.id)}
                        className="w-16 h-16 bg-slate-900 dark:bg-blue-600 text-white rounded-[2rem] flex items-center justify-center hover:scale-110 transition-all hover:shadow-2xl active:scale-95 group/btn shadow-xl shadow-blue-500/20"
                      >
                        <ArrowRight size={28} className="group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full py-20 text-center">
                 <FilterX size={64} className="mx-auto text-slate-300 mb-4" />
                 <h3 className="text-xl font-black uppercase italic dark:text-white">No Visas Found!</h3>
                 <p className="text-slate-500">Try changing the category or search for another country.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* 🛡️ 5. TRUST BANNER */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto bg-blue-600 rounded-[4rem] p-12 lg:p-20 text-white relative overflow-hidden shadow-2xl shadow-blue-600/30">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl shadow-2xl" />
          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
             <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-black uppercase italic leading-none">Your Trusted Partner in <span className="text-slate-900">Global Careers.</span></h2>
                <p className="text-blue-100 font-bold max-w-md">GameRoutes ensures 100% direct contracts with verified employers and educational institutions worldwide.</p>
                <div className="flex flex-wrap gap-4">
                  {["Verified Direct Deals", "No Processing Fee", "Real-time Tracking"].map((tag, i) => (
                    <span key={i} className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase italic tracking-widest">{tag}</span>
                  ))}
                </div>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 p-8 rounded-[3rem] border border-white/10 text-center">
                   <ShieldCheck size={40} className="mx-auto mb-3" />
                   <p className="text-3xl font-black italic uppercase leading-none">Safe</p>
                   <p className="text-[9px] font-bold opacity-70 uppercase mt-1">GDPR Protected</p>
                </div>
                <div className="bg-slate-900 p-8 rounded-[3rem] text-center shadow-2xl">
                   <CheckCircle2 size={40} className="mx-auto mb-3 text-blue-500" />
                   <p className="text-3xl font-black italic uppercase leading-none">10k+</p>
                   <p className="text-[9px] font-bold opacity-70 uppercase mt-1">Successful Visas</p>
                </div>
             </div>
          </div>
        </div>
      </section>


      {/* Tailwind Custom Animation Style */}
      <style jsx>{`
        @keyframes gradient-xy {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-xy {
          animation: gradient-xy 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Visa;