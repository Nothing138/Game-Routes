import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import Swal from 'sweetalert2';
import { 
  User, MapPin, GraduationCap, Code, FileText, 
  Send, ArrowLeft, Camera, DollarSign, Globe, Loader2
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const Apply = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const [formData, setFormData] = useState({
    full_name: user?.name || '', // user object অনুযায়ী key change হতে পারে
    address: '',
    nationality: '',
    current_location: '',
    qualification: '',
    skills: '',
    demand: '',
    cv: null,
    photo: null
  });

  const [loading, setLoading] = useState(false);

  // Validation Check: cv, full_name, demand are mandatory
  const isFormValid = formData.full_name && formData.demand && formData.cv;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    data.append('job_id', jobId);
    data.append('candidate_id', user.id);

    try {
      const res = await axios.post('http://localhost:5000/api/user-jobs/apply', data);
      
      if (res.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Your application has been submitted successfully.',
          confirmButtonColor: '#2563eb',
          background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#fff',
          color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
        });
        navigate('/'); // সাবমিট করার পর হোম পেজে চলে যাবে
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong! Please try again.',
        background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#fff',
        color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 dark:bg-[#020617] pt-40 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-8 font-black uppercase text-[10px] tracking-widest"
          >
            <ArrowLeft size={16} /> Back to job list
          </button>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-500/5"
          >
            {/* Header Section */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-10 text-white">
              <h2 className="text-3xl lg:text-4xl font-black uppercase italic tracking-tighter">Submit Application</h2>
              <p className="opacity-70 text-sm font-bold uppercase tracking-widest mt-2">Complete the form to apply for ID: {jobId}</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 lg:p-12 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Full Name */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      required name="full_name" value={formData.full_name} onChange={handleChange}
                      className="w-full pl-14 pr-6 py-4 bg-slate-100/50 dark:bg-slate-800/50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 dark:text-white transition-all font-bold" 
                      placeholder="Enter your full name" 
                    />
                  </div>
                </div>

                {/* Nationality */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Nationality</label>
                  <div className="relative">
                    <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      name="nationality" onChange={handleChange}
                      className="w-full pl-14 pr-6 py-4 bg-slate-100/50 dark:bg-slate-800/50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 dark:text-white transition-all font-bold" 
                      placeholder="e.g. Bangladeshi" 
                    />
                  </div>
                </div>

                {/* Qualification */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Latest Qualification</label>
                  <div className="relative">
                    <GraduationCap className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      name="qualification" onChange={handleChange}
                      className="w-full pl-14 pr-6 py-4 bg-slate-100/50 dark:bg-slate-800/50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 dark:text-white transition-all font-bold" 
                      placeholder="e.g. MBA or BSc" 
                    />
                  </div>
                </div>

                {/* Current Location */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Current Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      name="current_location" onChange={handleChange}
                      className="w-full pl-14 pr-6 py-4 bg-slate-100/50 dark:bg-slate-800/50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 dark:text-white transition-all font-bold" 
                      placeholder="e.g. Dhaka, Bangladesh" 
                    />
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Professional Skills</label>
                <div className="relative">
                  <Code className="absolute left-5 top-6 text-slate-400" size={18} />
                  <textarea 
                    name="skills" rows="3" onChange={handleChange}
                    className="w-full pl-14 pr-6 py-5 bg-slate-100/50 dark:bg-slate-800/50 border-none rounded-3xl outline-none focus:ring-2 focus:ring-blue-600 dark:text-white transition-all font-bold" 
                    placeholder="e.g. React.js, Node.js, Project Management" 
                  />
                </div>
              </div>

              {/* Demand / Expected Salary (Required) */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Your Demand / Expected Salary *</label>
                <div className="relative">
                  <DollarSign className="absolute left-5 top-6 text-slate-400" size={18} />
                  <textarea 
                    required name="demand" rows="3" onChange={handleChange}
                    className="w-full pl-14 pr-6 py-5 bg-slate-100/50 dark:bg-slate-800/50 border-none rounded-3xl outline-none focus:ring-2 focus:ring-blue-600 dark:text-white transition-all font-bold" 
                    placeholder="What is your demand or expectation for this role?" 
                  />
                </div>
              </div>

              {/* File Uploads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* CV Upload */}
                <div className="group p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] text-center hover:border-blue-500 transition-all bg-slate-50/50 dark:bg-slate-900/20">
                  <FileText className="mx-auto text-blue-600 mb-3 group-hover:scale-110 transition-transform" size={32} />
                  <p className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">Upload CV (PDF only) *</p>
                  <input 
                    required type="file" name="cv" accept=".pdf" onChange={handleFileChange}
                    className="mt-4 text-[10px] text-slate-400 cursor-pointer block w-full" 
                  />
                </div>

                {/* Photo Upload */}
                <div className="group p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] text-center hover:border-blue-500 transition-all bg-slate-50/50 dark:bg-slate-900/20">
                  <Camera className="mx-auto text-blue-600 mb-3 group-hover:scale-110 transition-transform" size={32} />
                  <p className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">Profile Photo (Optional)</p>
                  <input 
                    type="file" name="photo" accept="image/*" onChange={handleFileChange}
                    className="mt-4 text-[10px] text-slate-400 cursor-pointer block w-full" 
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={!isFormValid || loading}
                className={`w-full py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-3 transition-all
                  ${isFormValid 
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-500/20 active:scale-95' 
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'}
                `}
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>Submit Application <Send size={16} /></>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Apply;