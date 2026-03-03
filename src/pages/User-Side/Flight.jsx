import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom';
import { Plane, Calendar, Users, MapPin, Phone, Mail, User, ShieldCheck, Lock, ArrowRight } from 'lucide-react';
import Navbar from '../../components/Navbar'; 
import Footer from '../../components/Footer'; 

const Flight = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const [formData, setFormData] = useState({
        full_name: '',
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

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.id) {
            setIsLoggedIn(true);
            setUser(storedUser);
            fetchUserDetails(storedUser.id, storedUser);
        }
        setLoading(false);
    }, []);

    const fetchUserDetails = async (userId, basicUser) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/user-details/${userId}`);
            const details = response.data;
            setFormData(prev => ({
                ...prev,
                full_name: basicUser?.full_name || (details.first_name ? `${details.first_name} ${details.surname}` : ''),
                email: basicUser?.email || '',
                contact_number: details.phone_number || '',
                address: details.current_location || '',
                passport_number: details.passport_number || '',
            }));
        } catch (error) {
            console.error("Error fetching user details", error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isLoggedIn) {
            return Swal.fire({
                title: 'Login Required',
                text: 'Please login to send a flight request.',
                icon: 'warning',
                confirmButtonText: 'Login Now',
                confirmButtonColor: '#2563eb'
            }).then((result) => {
                if (result.isConfirmed) navigate('/login');
            });
        }

        if (!formData.policy_accepted) {
            return Swal.fire('Policy!', 'Please accept the flight policy.', 'info');
        }

        try {
            const response = await axios.post('http://localhost:5000/api/flight-request', {
                ...formData,
                user_id: user.id
            });
            if (response.data.success) {
                Swal.fire({
                    title: 'Request Sent!',
                    text: 'Our team will contact you soon.',
                    icon: 'success',
                    timer: 3000
                });
            }
        } catch (error) {
            Swal.fire('Error', 'Submission failed. Try again.', 'error');
        }
    };

    if (loading) return <div className="h-screen flex justify-center items-center">Loading...</div>;

    return (
        <div className="flex flex-col min-h-screen font-sans selection:bg-blue-100">
            <Navbar />

            {/* Main Content with Background Image */}
            <main className="relative flex-grow pt-38 pb-16 overflow-hidden">
                {/* Background Image & Overlay */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1436491865332-7a61a109c053?q=80&w=2070&auto=format&fit=crop" 
                        alt="Flight Background" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-blue-900/40 backdrop-blur-[2px]"></div>
                </div>

                <div className="relative z-10 max-w-6xl mx-auto px-4 grid lg:grid-cols-5 gap-12 items-start">
                    
                    {/* Left Side: Info Text */}
                    <div className="lg:col-span-2 text-white pt-10">
                        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
                            <span className="bg-blue-600/30 text-blue-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-500/30">
                                Premium Flight Service
                            </span>
                            <h1 className="text-5xl font-extrabold mt-6 leading-[1.1] tracking-tighter italic">
                                FLY TO YOUR <br /> <span className="text-blue-500 underline decoration-blue-500/30">DREAM</span> DESTINATION
                            </h1>
                            <p className="mt-6 text-slate-300 text-lg leading-relaxed max-w-md">
                                Experience the gold standard in travel. Fill out the request and let our specialists handle your itinerary.
                            </p>
                            
                            <div className="mt-10 flex gap-6">
                                <div className="flex flex-col">
                                    <span className="text-3xl font-bold">24/7</span>
                                    <span className="text-slate-400 text-xs uppercase tracking-tighter">Support</span>
                                </div>
                                <div className="w-[1px] bg-slate-700"></div>
                                <div className="flex flex-col">
                                    <span className="text-3xl font-bold">100+</span>
                                    <span className="text-slate-400 text-xs uppercase tracking-tighter">Destinations</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Side: Form / Login Prompt */}
                    <div className="lg:col-span-3 w-full">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }} 
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[2.5rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.5)] border border-white/20 overflow-hidden"
                        >
                            {!isLoggedIn ? (
                                /* Login Wall */
                                <div className="p-12 text-center flex flex-col items-center">
                                    <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
                                        <Lock className="text-blue-600" size={32} />
                                    </div>
                                    <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Member Access Only</h2>
                                    <p className="text-slate-500 mt-2 max-w-xs">You need to be logged in to access our premium flight booking system.</p>
                                    <Link to="/login" className="mt-8 group flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/30">
                                        Login to Account <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                    <p className="mt-6 text-sm text-slate-400">Don't have an account? <Link to="/register" className="text-blue-500 font-semibold hover:underline">Register now</Link></p>
                                </div>
                            ) : (
                                /* The Form */
                                <>
                                    <div className="bg-slate-100 dark:bg-slate-800/50 p-6 px-10 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                                        <div>
                                            <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase italic">Flight Request</h2>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Booking Reference: FR-{new Date().getFullYear()}</p>
                                        </div>
                                        <Plane className="text-blue-600 opacity-20" size={40} />
                                    </div>

                                    <form onSubmit={handleSubmit} className="p-10 grid grid-cols-1 md:grid-cols-2 gap-5">
                                        {/* Trip Type Selector */}
                                        <div className="md:col-span-2 flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-2">
                                            {['oneway', 'roundtrip'].map((type) => (
                                                <button key={type} type="button" onClick={() => setFormData({...formData, trip_type: type})} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all ${formData.trip_type === type ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-400'}`}>
                                                    {type === 'oneway' ? 'One Way' : 'Round Trip'}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Input Fields */}
                                        {[
                                            { label: 'Full Name', name: 'full_name', icon: User, placeholder: 'John Doe', required: true },
                                            { label: 'Email', name: 'email', icon: Mail, placeholder: 'john@example.com', type: 'email' },
                                            { label: 'Passport Number', name: 'passport_number', icon: ShieldCheck, placeholder: 'Passport ID', required: true },
                                            { label: 'Contact Number', name: 'contact_number', icon: Phone, placeholder: '+880...', required: true },
                                            { label: 'Departure From', name: 'departure_city', icon: MapPin, placeholder: 'City, Country', required: true },
                                            { label: 'Arrival To', name: 'destination_city', icon: MapPin, placeholder: 'City, Country', required: true },
                                            { label: 'Travel Date', name: 'travel_date', icon: Calendar, type: 'date', required: true },
                                            { label: 'Passengers', name: 'passenger_count', icon: Users, type: 'number', required: true },
                                        ].map((field) => (
                                            <div key={field.name} className="space-y-1.5">
                                                <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">{field.label} {field.required && '*'}</label>
                                                <div className="relative">
                                                    <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                                    <input 
                                                        required={field.required}
                                                        type={field.type || 'text'}
                                                        name={field.name}
                                                        value={formData[field.name]}
                                                        onChange={handleChange}
                                                        placeholder={field.placeholder}
                                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm dark:text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                                                    />
                                                </div>
                                            </div>
                                        ))}

                                        <div className="md:col-span-2 space-y-1.5">
                                            <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Address</label>
                                            <textarea name="address" value={formData.address} onChange={handleChange} rows="2" className="w-full p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm dark:text-white outline-none focus:ring-2 focus:ring-blue-600" placeholder="Your residential address..."></textarea>
                                        </div>

                                        <div className="md:col-span-2 flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                                            <input required type="checkbox" name="policy_accepted" checked={formData.policy_accepted} onChange={handleChange} className="w-4 h-4 rounded border-slate-300 text-blue-600" />
                                            <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase leading-relaxed">
                                                I confirm that all provided details match my official travel documents.
                                            </p>
                                        </div>

                                        <button type="submit" className="md:col-span-2 w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-[0.2em] rounded-xl shadow-xl shadow-blue-600/20 transition-all active:scale-95 flex items-center justify-center gap-3 mt-2">
                                            <Plane size={18} />
                                            Confirm Booking Request
                                        </button>
                                    </form>
                                </>
                            )}
                        </motion.div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Flight;