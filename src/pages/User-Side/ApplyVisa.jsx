import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { User, MapPin, CreditCard, Briefcase, Phone, Calendar, ArrowLeft, Send, Camera, FileText, Globe, CheckCircle } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const ApplyVisa = () => {
    const { visaId } = useParams();
    const navigate = useNavigate();
    const [visaInfo, setVisaInfo] = useState(null);
    const [photo, setPhoto] = useState(null);
    const [passportFile, setPassportFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        first_name: '', surname: '', nationality: '', country: '', gender: 'Male',
        dob: '', id_number: '', passport: '', passport_expiry: '',
        location: '', profession: '', phone: ''
    });

    useEffect(() => {
        axios.get(`http://localhost:5000/api/visas`).then(res => {
            setVisaInfo(res.data.find(v => v.id == visaId));
        });
    }, [visaId]);

    const checkPassportExpiry = (expiryDate) => {
        const today = new Date();
        const expiry = new Date(expiryDate);
        const diffTime = Math.abs(expiry - today);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays < 90; // Less than 3 months (90 days)
    };

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token'); // Secret code/token nilam
    const userString = localStorage.getItem('user');
    let userId = null;

    if (userString) {
        const userData = JSON.parse(userString);
        userId = userData.id ; 
    }
    console.log("Submit check - ID:", userId);

    if (!token || !userId) {
        setLoading(false);
        return Swal.fire('Error', 'Session expired! Please login again.', 'error');
    }

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    data.append('user_id', userId);
    data.append('visa_id', visaId);
    
    if (photo) data.append('photo', photo);
    if (passportFile) data.append('passport_file', passportFile);

    try {
        const res = await axios.post('http://localhost:5000/api/visas/apply', data, {
            headers: { 
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}` // Header-e secret code pathano
            }
        });
        
        if (res.data.success) {
            Swal.fire('Success!', 'Application Submitted.', 'success');
            navigate('/');
        }
    } catch (error) {
        console.error("Submission Error:", error);
        // Error handling fix
        const errorMsg = error.response?.data?.details || "Database error!";
        Swal.fire('Error', errorMsg, 'error');
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="min-h-screen bg-[#020617] text-white">
            <Navbar />
            <div className="max-w-6xl mx-auto pt-32 pb-20 px-6">
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left: Info Card */}
                    <div className="space-y-6">
                        <div className="p-8 bg-blue-600 rounded-[3rem] shadow-2xl shadow-blue-500/20 relative overflow-hidden group">
                            <Globe size={150} className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform" />
                            <h2 className="text-4xl font-black italic uppercase leading-none">{visaInfo?.country_name}</h2>
                            <p className="mt-2 font-bold text-blue-100 uppercase tracking-widest">{visaInfo?.type} VISA PORTAL</p>
                            <div className="mt-10 py-3 px-6 bg-white/10 backdrop-blur-md rounded-2xl inline-block font-black text-2xl">
                                FEE: ${visaInfo?.application_charge}
                            </div>
                        </div>
                        <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-[2rem] flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-500"><CheckCircle /></div>
                            <p className="text-xs font-bold uppercase text-slate-400">Secure 256-bit encrypted application processing</p>
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 md:p-12 rounded-[4rem] shadow-3xl">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-blue-500 tracking-tighter ml-2">Given Name</label>
                                    <input required placeholder="First Name" className="w-full p-5 bg-slate-800/50 border border-slate-700/50 rounded-2xl outline-none focus:border-blue-500 transition-all" onChange={e => setFormData({...formData, first_name: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-blue-500 tracking-tighter ml-2">Surname</label>
                                    <input required placeholder="Last Name" className="w-full p-5 bg-slate-800/50 border border-slate-700/50 rounded-2xl outline-none focus:border-blue-500 transition-all" onChange={e => setFormData({...formData, surname: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-blue-500 tracking-tighter ml-2">Nationality</label>
                                    <input required placeholder="Your Country" className="w-full p-5 bg-slate-800/50 border border-slate-700/50 rounded-2xl outline-none focus:border-blue-500 transition-all" onChange={e => setFormData({...formData, nationality: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-blue-500 tracking-tighter ml-2">Gender</label>
                                    <select className="w-full p-5 bg-slate-800/50 border border-slate-700/50 rounded-2xl outline-none focus:border-blue-500 transition-all appearance-none" onChange={e => setFormData({...formData, gender: e.target.value})}>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-blue-500 tracking-tighter ml-2">Passport Number</label>
                                    <input required placeholder="Ex: A0123456" className="w-full p-5 bg-slate-800/50 border border-slate-700/50 rounded-2xl outline-none focus:border-blue-500 transition-all" onChange={e => setFormData({...formData, passport: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-blue-500 tracking-tighter ml-2">Passport Expiry</label>
                                    <input required type="date" className="w-full p-5 bg-slate-800/50 border border-slate-700/50 rounded-2xl outline-none focus:border-blue-500 transition-all" onChange={e => setFormData({...formData, passport_expiry: e.target.value})} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
                                <div className="relative group">
                                    <div className="p-8 border-2 border-dashed border-slate-700 rounded-3xl hover:border-blue-500 transition-colors text-center cursor-pointer overflow-hidden">
                                        <Camera className="mx-auto text-blue-500 mb-2" />
                                        <p className="text-[10px] font-black uppercase">Photo (JPEG)</p>
                                        <input type="file" required accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setPhoto(e.target.files[0])} />
                                        {photo && <p className="text-[9px] text-green-500 mt-2 font-bold uppercase">{photo.name}</p>}
                                    </div>
                                </div>
                                <div className="relative group">
                                    <div className="p-8 border-2 border-dashed border-slate-700 rounded-3xl hover:border-blue-500 transition-colors text-center cursor-pointer overflow-hidden">
                                        <FileText className="mx-auto text-blue-500 mb-2" />
                                        <p className="text-[10px] font-black uppercase">Passport Copy (PDF/JPG)</p>
                                        <input type="file" required accept="image/*,application/pdf" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setPassportFile(e.target.files[0])} />
                                        {passportFile && <p className="text-[9px] text-green-500 mt-2 font-bold uppercase">{passportFile.name}</p>}
                                    </div>
                                </div>
                            </div>

                            <button disabled={loading} type="submit" className={`w-full py-6 rounded-[2rem] font-black uppercase italic tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${loading ? 'bg-slate-800 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-500/40 active:scale-95'}`}>
                                {loading ? 'Processing...' : 'Submit Application'} <Send size={20} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ApplyVisa;