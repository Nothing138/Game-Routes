import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { FileText, ShieldAlert, CheckCircle, MapPin, Globe, Activity, Upload } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const ApplyTours = () => {
  const { id } = useParams(); // Package ID
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    passport_number: '',
    passport_expiry: '',
    address: '',
    nationality: '',
    disease: '',
    passport_file: null
  });

  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [expiryWarning, setExpiryWarning] = useState(false);

  // ১. ইউজার ডিটেইলস চেক করা (Auto-fill)
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/user-travel/user-info/${user.id}`);
        if (res.data.success) {
          const d = res.data.data;
          setFormData(prev => ({
            ...prev,
            passport_number: d.passport_number || '',
            passport_expiry: d.passport_expiry ? d.passport_expiry.split('T')[0] : '',
            address: d.current_location || '',
            nationality: d.nationality || '',
          }));
          // চেক করা যদি পাসপোর্ট ৩ মাসের মধ্যে এক্সপায়ার হয়
          checkExpiry(d.passport_expiry);
        }
      } catch (err) {
        console.error("Error auto-filling form", err);
      }
    };
    if (user) fetchUserDetails();
  }, [user.id]);

  // ২. পাসপোর্ট এক্সপায়ারি চেক লজিক
  const checkExpiry = (dateString) => {
    if (!dateString) return;
    const expiryDate = new Date(dateString);
    const today = new Date();
    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(today.getMonth() + 3);

    if (expiryDate <= threeMonthsLater) {
      setExpiryWarning(true);
    } else {
      setExpiryWarning(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'passport_expiry') checkExpiry(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (expiryWarning) {
      Swal.fire('Notice', 'Your passport expires soon. Please consult with our experts.', 'warning');
      return;
    }

    try {
      // এখানে ডাটাবেসে সেভ করার কল হবে
      const res = await axios.post('http://localhost:5000/api/user-travel/apply-tour', {
        ...formData,
        user_id: user.id,
        package_id: id
      });

      if (res.data.success) {
        Swal.fire('Success', 'Application submitted for review!', 'success');
        navigate('/travel');
      }
    } catch (err) {
      Swal.fire('Error', 'Submission failed.', 'error');
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 dark:bg-[#020617] py-20 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl p-10 lg:p-16 border border-slate-100 dark:border-slate-800"
        >
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-black uppercase italic dark:text-white">Complete Your <span className="text-emerald-500">Booking</span></h2>
            <p className="text-slate-500 mt-2">Please provide your travel documents for verification.</p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest dark:text-slate-400 flex items-center gap-2"><FileText size={14}/> Full Name</label>
              <input type="text" name="full_name" value={formData.full_name} onChange={handleInputChange} className="w-full bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl dark:text-white border-none focus:ring-2 focus:ring-emerald-500 outline-none transition-all" required />
            </div>

            {/* Passport Number */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest dark:text-slate-400 flex items-center gap-2"><ShieldAlert size={14}/> Passport Number</label>
              <input type="text" name="passport_number" value={formData.passport_number} onChange={handleInputChange} className="w-full bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl dark:text-white border-none focus:ring-2 focus:ring-emerald-500 outline-none" required />
            </div>

            {/* Passport Expiry */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest dark:text-slate-400 flex items-center gap-2">Passport Expiry Date</label>
              <input type="date" name="passport_expiry" value={formData.passport_expiry} onChange={handleInputChange} className="w-full bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl dark:text-white border-none focus:ring-2 focus:ring-emerald-500 outline-none" required />
              {expiryWarning && (
                <p className="text-red-500 text-[10px] font-bold mt-1">⚠️ Expiry within 3 months! Contact our consultant immediately.</p>
              )}
            </div>

            {/* Nationality */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest dark:text-slate-400 flex items-center gap-2"><Globe size={14}/> Nationality</label>
              <input type="text" name="nationality" value={formData.nationality} onChange={handleInputChange} className="w-full bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl dark:text-white border-none focus:ring-2 focus:ring-emerald-500 outline-none" required />
            </div>

            {/* Disease info */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-black uppercase tracking-widest dark:text-slate-400 flex items-center gap-2"><Activity size={14}/> Medical Conditions (If any)</label>
              <textarea name="disease" placeholder="Any special medical care needed?" value={formData.disease} onChange={handleInputChange} className="w-full bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl dark:text-white border-none focus:ring-2 focus:ring-emerald-500 outline-none h-32" />
            </div>

            {/* Policy Check */}
            <div className="md:col-span-2 flex items-start gap-4 p-6 bg-emerald-500/5 rounded-3xl border border-emerald-500/20">
              <input 
                type="checkbox" 
                id="policy" 
                className="mt-1 w-5 h-5 accent-emerald-500"
                onChange={(e) => setPolicyAccepted(e.target.checked)}
              />
              <label htmlFor="policy" className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                I agree to the <strong>Travel Policy & Rules</strong>. I confirm that all provided data is accurate and my passport is valid for travel.
              </label>
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2">
              <button 
                disabled={!policyAccepted}
                className={`w-full py-5 rounded-full font-black uppercase tracking-widest text-sm transition-all shadow-xl ${policyAccepted ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}
              >
                Submit Application
              </button>
            </div>
          </form>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default ApplyTours;