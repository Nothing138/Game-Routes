import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, MapPin, DollarSign, Clock, 
  Search, Filter, ChevronRight, Building2, 
  Zap, GraduationCap, Users
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const Job = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'IT & Tech', 'Engineering', 'Hospitality', 'Construction', 'Healthcare'];

  const jobs = [
    {
      id: 1,
      title: "Software Engineer",
      company: "TechNordic",
      location: "Stockholm, Sweden",
      salary: "€4000 - €5500",
      type: "Full Time",
      category: "IT & Tech",
      posted: "2 days ago",
      logo: "https://ui-avatars.com/api/?name=TN&background=0D8ABC&color=fff"
    },
    {
      id: 2,
      title: "Civil Engineer",
      company: "BuildGlobal",
      location: "Warsaw, Poland",
      salary: "€2500 - €3500",
      type: "Contract",
      category: "Engineering",
      posted: "5 days ago",
      logo: "https://ui-avatars.com/api/?name=BG&background=F59E0B&color=fff"
    },
    {
      id: 3,
      title: "Hotel Manager",
      company: "Algarve Resorts",
      location: "Faro, Portugal",
      salary: "€2000 - €2800",
      type: "Full Time",
      category: "Hospitality",
      posted: "1 day ago",
      logo: "https://ui-avatars.com/api/?name=AR&background=EC4899&color=fff"
    },
    {
      id: 4,
      title: "Registered Nurse",
      company: "EuroHealth",
      location: "Berlin, Germany",
      salary: "€3200 - €4500",
      type: "Full Time",
      category: "Healthcare",
      posted: "3 days ago",
      logo: "https://ui-avatars.com/api/?name=EH&background=10B981&color=fff"
    }
  ];

  const filteredJobs = jobs.filter(job => {
    const matchesCategory = activeCategory === 'All' || job.category === activeCategory;
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          job.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-28 pb-20 px-6 lg:px-12">
      
      {/* 🎯 HEADER SECTION */}
      <div className="max-w-7xl mx-auto mb-12 text-center lg:text-left">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h1 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
            Find Your <span className="text-blue-600">Dream Job</span> Abroad
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl font-medium">
            Explore thousands of job opportunities across Europe and Beyond. We connect talented professionals with top-tier global employers.
          </p>
        </motion.div>
      </div>

      {/* 🔍 SEARCH & FILTER BAR */}
      <div className="max-w-7xl mx-auto mb-10 space-y-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Job title, keywords, or company..."
              className="w-full pl-14 pr-6 py-5 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border-none outline-none ring-1 ring-slate-200 dark:ring-slate-800 focus:ring-2 focus:ring-blue-600 transition-all dark:text-white"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-4 rounded-2xl whitespace-nowrap font-bold text-xs uppercase tracking-widest transition-all ${
                  activeCategory === cat 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                  : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 💼 JOB LISTINGS */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 gap-4">
        <AnimatePresence mode='popLayout'>
          {filteredJobs.map((job) => (
            <motion.div
              key={job.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              whileHover={{ x: 10 }}
              className="bg-white dark:bg-slate-900 p-6 lg:p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 group transition-all hover:border-blue-200 dark:hover:border-blue-900"
            >
              <div className="flex items-center gap-6">
                <img src={job.logo} alt={job.company} className="w-16 h-16 rounded-2xl object-cover shadow-inner" />
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{job.title}</h3>
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-slate-500 dark:text-slate-400 text-sm font-medium">
                    <span className="flex items-center gap-1"><Building2 size={14}/> {job.company}</span>
                    <span className="flex items-center gap-1"><MapPin size={14}/> {job.location}</span>
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-bold uppercase text-blue-600">{job.type}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-12">
                <div className="hidden md:block text-right">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Offered Salary</p>
                  <p className="text-lg font-black text-slate-900 dark:text-white italic">{job.salary}</p>
                </div>
                <button className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-xl shadow-slate-200 dark:shadow-none">
                  Apply Now <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredJobs.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
            <Briefcase size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 font-bold uppercase tracking-widest">No jobs found in this category</p>
          </div>
        )}
      </div>

      {/* 🚀 QUICK STATS SECTION */}
      <div className="max-w-7xl mx-auto mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: <Zap className="text-yellow-500" />, title: "Instant Apply", desc: "One-click application process" },
          { icon: <GraduationCap className="text-blue-500" />, title: "Skills Matching", desc: "Get matched with right roles" },
          { icon: <Users className="text-green-500" />, title: "Expert Guidance", desc: "Free career counseling session" }
        ].map((stat, i) => (
          <div key={i} className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex items-start gap-5">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">{stat.icon}</div>
            <div>
              <h4 className="font-black text-slate-900 dark:text-white uppercase italic">{stat.title}</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    <Footer />
    </>
  );
};

export default Job;