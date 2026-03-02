import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // রিডাইরেক্ট করার জন্য
import Swal from 'sweetalert2'; // এলার্ট এর জন্য
import { 
  Briefcase, MapPin, Search, Building2, 
  ArrowUpDown, Loader2
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const Job = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const navigate = useNavigate();

  const types = ['All', 'on-site', 'remote', 'hybrid'];

  // --- Check Login & Handle Apply ---
  const handleApply = (jobId) => {
    const user = JSON.parse(localStorage.getItem('user')); // আপনার লগইন সিস্টেম অনুযায়ী কি (key) পরিবর্তন হতে পারে

    if (!user) {
      Swal.fire({
        title: '<strong>Access Denied!</strong>',
        icon: 'warning',
        html: 'You must be <b>Logged In</b> to apply for this job.',
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Login Now',
        cancelButtonText: 'Maybe Later',
        confirmButtonColor: '#2563eb', // blue-600
        background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#fff',
        color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
        customClass: {
          popup: 'rounded-[2rem]',
          confirmButton: 'rounded-xl font-bold uppercase tracking-widest text-xs px-6 py-3',
          cancelButton: 'rounded-xl font-bold uppercase tracking-widest text-xs px-6 py-3'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login'); // লগইন পেজে পাঠিয়ে দিবে
        }
      });
    } else {
      // যদি লগইন থাকে তবে অ্যাপ্লাই পেজে নিয়ে যাবে
      navigate(`/apply-job/${jobId}`);
    }
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/user-jobs/all`, {
        params: { page, type: activeType, search: searchQuery, sort: sortBy }
      });
      setJobs(res.data.jobs);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Error fetching jobs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page, activeType, sortBy]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setPage(1);
      fetchJobs();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 dark:bg-[#020617] pt-40 pb-20 px-6 lg:px-12">
        
        {/* 🎯 HEADER */}
        <div className="max-w-7xl mx-auto mb-16 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-8xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter"
          >
            Global <span className="text-blue-600">Careers</span>
          </motion.h1>
          <p className="text-slate-500 mt-4 text-lg font-medium">Connecting Talent with World-Class Opportunities</p>
        </div>

        {/* 🔍 FILTER & SEARCH BAR */}
        <div className="max-w-7xl mx-auto mb-12 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-5 relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
              <input 
                type="text" placeholder="Search by title or company..."
                className="w-full pl-14 pr-6 py-5 bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-blue-600 transition-all dark:text-white"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="lg:col-span-4 flex gap-2 overflow-x-auto no-scrollbar">
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => { setActiveType(type); setPage(1); }}
                  className={`px-6 py-4 rounded-2xl whitespace-nowrap font-black text-[10px] uppercase tracking-widest transition-all ${
                    activeType === type ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white dark:bg-slate-900 dark:text-slate-400 border border-slate-100 dark:border-slate-800'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="lg:col-span-3">
              <div className="relative flex items-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 px-5">
                <ArrowUpDown size={18} className="text-slate-400" />
                <select 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full py-5 bg-transparent outline-none dark:text-white font-bold text-xs uppercase tracking-widest pl-3 cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="high">Salary: High to Low</option>
                  <option value="low">Salary: Low to High</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 💼 JOB LISTINGS */}
        <div className="max-w-7xl mx-auto min-h-[400px]">
          {loading ? (
            <div className="flex justify-center items-center py-20"><Loader2 className="animate-spin text-blue-600" size={48} /></div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              <AnimatePresence mode='popLayout'>
                {jobs.map((job) => (
                  <motion.div
                    key={job.id} layout
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="group bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 p-8 rounded-[2.5rem] flex flex-col lg:flex-row justify-between items-center hover:border-blue-500/50 transition-all hover:shadow-2xl hover:shadow-blue-500/5"
                  >
                    <div className="flex items-center gap-8 w-full">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-3xl flex items-center justify-center text-white font-black text-2xl shadow-lg">
                        {job.company_name.charAt(0)}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-2xl font-black text-slate-900 dark:text-white italic uppercase">{job.job_title}</h3>
                          <span className="px-3 py-1 bg-blue-600/10 text-blue-500 rounded-full text-[9px] font-black uppercase tracking-tighter">{job.job_type}</span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider">
                          <span className="flex items-center gap-2"><Building2 size={16} className="text-blue-500"/> {job.company_name}</span>
                          <span className="flex items-center gap-2"><MapPin size={16} className="text-blue-500"/> {job.country}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-10 mt-6 lg:mt-0 w-full lg:w-auto justify-between lg:justify-end">
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Package</p>
                        <p className="text-xl font-black text-slate-900 dark:text-white">${job.salary_range}</p>
                      </div>
                      {/* --- UPDATED BUTTON --- */}
                      <button 
                        onClick={() => handleApply(job.id)}
                        className="px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-blue-500/20 group-hover:scale-105"
                      >
                        Apply Now
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Pagination */}
          {!loading && jobs.length > 0 && (
            <div className="flex justify-center mt-12 gap-3">
              {[...Array(totalPages)].map((_, i) => (
                <button 
                  key={i} onClick={() => setPage(i + 1)}
                  className={`w-12 h-12 rounded-xl font-black transition-all ${page === i + 1 ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-400 border border-slate-200 dark:border-slate-800'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Job;