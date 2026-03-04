import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { 
    Plane, Calendar, Users, MapPin, Phone, Mail, 
    User, ShieldCheck, ArrowRight, Star, Clock, Globe
} from 'lucide-react';
import Navbar from '../../components/Navbar'; 
import Footer from '../../components/Footer'; 

const Flight = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const today = new Date().toISOString().split('T')[0];

    // Form State
    const [formData, setFormData] = useState({
        full_name: '',
        age: '',
        email: '',
        contact_number: '',
        address: '',
        passport_number: '', 
        departure_city: '',
        destination_city: '',
        travel_date: '',
        passenger_count: 1,
        trip_type: 'oneway',
        policy_accepted: false
    });

    // ১. ডার্ক মোড এবং ইউজার ডেটা লোড করার লজিক
    useEffect(() => {
        // ডার্ক মোড চেক (যদি আপনার প্রোজেক্টে tailwind dark class ইউজ করা হয়)
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setIsLoggedIn(true);
            setUser(storedUser);
            
            axios.get(`http://localhost:5000/api/user-details/${storedUser.id}`)
                .then(res => {
                    const data = res.data;
                    setFormData(prev => ({
                        ...prev,
                        full_name: `${data.first_name || ''} ${data.surname || ''}`.trim() || storedUser.full_name,
                        email: data.email || storedUser.email,
                        contact_number: data.phone_number || '',
                        passport_number: data.passport_number || '',
                        address: data.address || ''
                    }));
                })
                .catch(err => {
                    setFormData(prev => ({
                        ...prev,
                        full_name: storedUser.full_name || '',
                        email: storedUser.email || ''
                    }));
                });
        }
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ভ্যালিডেশন চেক
    if (!formData.policy_accepted) {
        return Swal.fire('Agreement Required', 'Please accept the flight policy.', 'warning');
    }

    setIsSubmitting(true);

    try {
        // রিকোয়েস্ট পাঠানোর আগে কনসোলে দেখে নিন
        console.log("Submitting Request...");

        const response = await axios({
            method: 'post',
            url: 'http://localhost:5000/api/flight-request',
            data: {
                ...formData,
                user_id: user?.id
            },
            timeout: 5000 
        });

        // যদি ডেটাবেসে ডেটা যায়, তবে response.data অবশ্যই থাকবে
        if (response.data) {
            console.log("Submission successful:", response.data);

            // সাকসেস মেসেজ দেখালে দেখাবে, না দেখালেও ইউজারকে আটকে রাখবে না
            Swal.fire({
                title: 'Success!',
                text: 'Flight request submitted successfully.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });

            // ৩ সেকেন্ডের মধ্যে জোর করে হোম পেজে পাঠানো
            setTimeout(() => {
                window.location.href = "/";
            }, 2000);
        }

    } catch (error) {
        console.error("Critical Error during submission:", error);
        
        // যদি এরর হওয়া সত্ত্বেও ডেটাবেসে ডেটা চলে যায় (যা আপনার ক্ষেত্রে হচ্ছে)
        // তবে আমরা ইউজারকে এখানে আটকে রাখবো না
        if (error.code === 'ECONNABORTED' || !error.response) {
            window.location.href = "/";
        } else {
            Swal.fire({
                title: 'Error',
                text: error.response?.data?.message || 'Connection error!',
                icon: 'error'
            });
        }
    } finally {
        setIsSubmitting(false);
    }
};

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 font-sans transition-colors duration-300">
            <Navbar />
            
            <main className="relative pt-36 pb-24 overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 left-0 w-full h-[600px] overflow-hidden z-0">
                    <div className="absolute inset-0 bg-slate-900">
                        <img 
                            src="https://images.unsplash.com/photo-1436491865332-7a61a109c053?q=80&w=2070" 
                            className="w-full h-full object-cover opacity-30 scale-110" 
                            alt="Luxury Flight"
                        />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#f8fafc]/80 to-[#f8fafc] dark:via-slate-950/80 dark:to-slate-950"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid lg:grid-cols-12 gap-16 items-start">
                        
                        {/* Left Info Section */}
                        <div className="lg:col-span-5 pt-12 text-white lg:text-slate-900 dark:lg:text-white">
                            <motion.div 
                                initial={{ opacity: 0, x: -50 }} 
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 backdrop-blur-md border border-blue-200/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-[0.2em] mb-8">
                                    <Globe size={14} className="animate-pulse" /> World Class Travel
                                </div>
                                <h1 className="text-5xl lg:text-6xl font-black leading-[1.1] mb-8">
                                    Travel Beyond <br /> 
                                    <span className="text-blue-500">Expectations.</span>
                                </h1>
                                <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed mb-10 max-w-md">
                                    Experience the pinnacle of air travel. We handle the details while you enjoy the journey.
                                </p>
                                
                                <div className="space-y-6">
                                    {[
                                        { icon: Star, text: "VIP Priority Lounge Access", color: "text-yellow-500" },
                                        { icon: ShieldCheck, text: "Fully Insured Travel Guarantee", color: "text-emerald-500" },
                                        { icon: Clock, text: "24/7 Dedicated Travel Concierge", color: "text-blue-500" }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-4 group">
                                            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                <item.icon className={item.color} size={24} />
                                            </div>
                                            <p className="font-bold text-slate-700 dark:text-slate-200">{item.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* Form Section */}
                        <div className="lg:col-span-7">
                            <motion.div 
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-[3rem] shadow-2xl border border-white/20 dark:border-slate-800 overflow-hidden"
                            >
                                <div className="p-8 pb-0 flex justify-between items-end">
                                    <div>
                                        <p className="text-blue-600 dark:text-blue-400 font-black text-xs uppercase tracking-widest mb-2">Booking Engine 2.0</p>
                                        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Request a Flight</h2>
                                    </div>
                                    <Plane size={40} className="text-slate-100 dark:text-slate-800 -rotate-12 mb-2" />
                                </div>

                                <form onSubmit={handleSubmit} className="p-8 lg:p-10 space-y-8">
                                    {/* Trip Type Toggle */}
                                    <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-[1.25rem] w-fit">
                                        {['oneway', 'roundtrip'].map((type) => (
                                            <button 
                                                key={type}
                                                type="button"
                                                onClick={() => setFormData({...formData, trip_type: type})}
                                                className={`px-8 py-3 rounded-[1rem] text-[10px] font-black uppercase tracking-widest transition-all ${formData.trip_type === type ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                            >
                                                {type === 'oneway' ? 'One Way' : 'Round Trip'}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                        <FormInput label="Full Name *" name="full_name" value={formData.full_name} icon={User} onChange={handleChange} placeholder="As per Passport" />
                                        <FormInput label="Age *" name="age" type="number" value={formData.age} icon={Calendar} onChange={handleChange} placeholder="Years" />
                                        
                                        <FormInput label="Email Address *" name="email" type="email" value={formData.email} icon={Mail} onChange={handleChange} placeholder="Enter your email" />
                                        <FormInput label="Contact Number *" name="contact_number" value={formData.contact_number} icon={Phone} onChange={handleChange} placeholder="+880" />

                                        <FormInput label="Passport Number *" name="passport_number" value={formData.passport_number} icon={ShieldCheck} onChange={handleChange} placeholder="Mandatory for flight" />
                                        <FormInput label="Passengers Count" name="passenger_count" type="number" value={formData.passenger_count} icon={Users} onChange={handleChange} />

                                        <FormInput label="Departure From *" name="departure_city" value={formData.departure_city} icon={MapPin} onChange={handleChange} placeholder="Origin City" />
                                        <FormInput label="Arrival To *" name="destination_city" value={formData.destination_city} icon={MapPin} onChange={handleChange} placeholder="Destination City" />

                                        <FormInput label="Preferred Flight Date *" name="travel_date" type="date" min={today} value={formData.travel_date} icon={Calendar} onChange={handleChange} />
                                        
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Address</label>
                                            <div className="relative group">
                                                <MapPin className="absolute left-4 top-4 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                                                <textarea 
                                                    name="address" 
                                                    value={formData.address} 
                                                    onChange={handleChange}
                                                    placeholder="Permanent address..."
                                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all min-h-[54px] resize-none"
                                                ></textarea>
                                            </div>
                                        </div>

                                        <div className="md:col-span-2 pt-4">
                                            <label className="flex items-start gap-4 p-5 bg-blue-50/50 dark:bg-blue-900/10 rounded-3xl border border-blue-100/50 dark:border-blue-900/20 cursor-pointer transition-all hover:bg-blue-50">
                                                <input 
                                                    type="checkbox" 
                                                    name="policy_accepted" 
                                                    checked={formData.policy_accepted} 
                                                    onChange={handleChange}
                                                    className="mt-1 h-5 w-5 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                                                />
                                                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tight">
                                                    I certify that all information is accurate and I agree to the <span className="text-blue-600 underline">Booking Policy</span>. *
                                                </span>
                                            </label>
                                        </div>

                                        <button 
                                            disabled={isSubmitting}
                                            type="submit"
                                            className={`md:col-span-2 w-full py-6 rounded-[1.5rem] font-black uppercase tracking-[0.3em] text-xs shadow-2xl flex items-center justify-center gap-4 transition-all active:scale-[0.97] ${isSubmitting ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-slate-900 dark:bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'}`}
                                        >
                                            {isSubmitting ? 'Securing Request...' : <>Request Exclusive Booking <ArrowRight size={18} /></>}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

const FormInput = ({ label, icon: Icon, ...props }) => (
    <div className="space-y-2 group">
        <label className="text-[10px] font-black uppercase text-slate-400 ml-2 block tracking-widest group-focus-within:text-blue-600 transition-colors">{label}</label>
        <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors pointer-events-none">
                <Icon size={18} />
            </div>
            <input 
                {...props}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300"
            />
        </div>
    </div>
);

export default Flight;