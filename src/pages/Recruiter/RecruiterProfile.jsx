import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { BuildingOffice2Icon, GlobeAltIcon, PhoneIcon, UserGroupIcon, PhotoIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

const RecruiterProfile = () => {
    const navigate = useNavigate();
    const [isExisting, setIsExisting] = useState(false); // Check if profile exists
    const [formData, setFormData] = useState({
        company_name: '',
        phone_number: '',
        company_website: '',
        company_bio: '',
        total_staff_count: 1
    });
    const [logo, setLogo] = useState(null);
    const [preview, setPreview] = useState(null);
    const userId = 1; // Pore dynamic koro

    // 1. Fetch Existing Data
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/recruiter/profile/${userId}`);
                if (res.data) {
                    setFormData(res.data);
                    setIsExisting(true);
                    if (res.data.company_logo) {
                        setPreview(`http://localhost:5000/${res.data.company_logo}`);
                    }
                }
            } catch (err) {
                console.log("No profile found, create a new one.");
            }
        };
        fetchProfile();
    }, [userId]);

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        setLogo(file);
        if (file) setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (logo) data.append('logo', logo);
        data.append('user_id', userId);

        try {
            const url = isExisting ? 'update' : 'register';
            const res = await axios.post(`http://localhost:5000/api/recruiter/${url}`, data);

            console.log("Server Response:", res.data);

            if (res.data.success) {
                if (!isExisting) {
                    Swal.fire({
                        title: 'Done!',
                        text: 'Company Profile Saved!',
                        icon: 'success',
                        background: '#1e293b',
                        color: '#fff',
                        timer: 1500,
                        showConfirmButton: false
                    }).then(() => {
                        navigate('/recruiter/dashboard');
                    });
                } else {
                    navigate('/recruiter/dashboard');
                }
            } else {
                // Jodi success false ashe
                alert("Save hoise kintu backend message pathay nai.");
            }
        } catch (err) {
            console.error("Full Error:", err);
            Swal.fire({ 
                icon: 'error', 
                title: 'Oops...', 
                text: 'Server-e connect kora jay nai.' 
            });
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] py-12 px-4 sm:px-6 lg:px-8 text-gray-200 font-sans">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-white tracking-tight flex justify-center items-center gap-2">
                        {isExisting ? <PencilSquareIcon className="size-8 text-indigo-400" /> : <BuildingOffice2Icon className="size-8 text-indigo-400" />}
                        {isExisting ? 'Update Company Profile' : 'Create Company Profile'}
                    </h2>
                    <p className="mt-2 text-gray-400">Manage your organization details effectively.</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-[#1e293b] shadow-2xl rounded-3xl overflow-hidden border border-slate-700/50 backdrop-blur-sm">
                    <div className="p-8 space-y-8">
                        
                        {/* Logo Upload Section */}
                        <div className="flex flex-col items-center justify-center border-b border-slate-700/50 pb-8">
                            <div className="relative group">
                                <div className="w-32 h-32 bg-[#334155] rounded-3xl border-2 border-dashed border-slate-500 flex items-center justify-center overflow-hidden transition-all group-hover:border-indigo-400">
                                    {preview ? (
                                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <PhotoIcon className="w-12 h-12 text-slate-500" />
                                    )}
                                </div>
                                <label className="absolute -bottom-2 -right-2 bg-indigo-500 p-2.5 rounded-xl cursor-pointer shadow-xl hover:bg-indigo-600 transition-all active:scale-90">
                                    <PhotoIcon className="w-5 h-5 text-white" />
                                    <input type="file" className="hidden" onChange={handleLogoChange} accept="image/*" />
                                </label>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Company Name */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-400">Company Name</label>
                                <div className="relative">
                                    <BuildingOffice2Icon className="absolute left-3 top-3.5 size-5 text-slate-500" />
                                    <input 
                                        type="text" 
                                        value={formData.company_name}
                                        className="pl-10 w-full p-3.5 bg-[#0f172a] border border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-white transition-all"
                                        placeholder="Company Name"
                                        onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                                        required 
                                    />
                                </div>
                            </div>

                            {/* Staff Count */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-400">Total Staff</label>
                                <div className="relative">
                                    <UserGroupIcon className="absolute left-3 top-3.5 size-5 text-slate-500" />
                                    <input 
                                        type="number" 
                                        value={formData.total_staff_count}
                                        className="pl-10 w-full p-3.5 bg-[#0f172a] border border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-white transition-all"
                                        onChange={(e) => setFormData({...formData, total_staff_count: e.target.value})}
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-400">Contact Number</label>
                                <div className="relative">
                                    <PhoneIcon className="absolute left-3 top-3.5 size-5 text-slate-500" />
                                    <input 
                                        type="text" 
                                        value={formData.phone_number}
                                        className="pl-10 w-full p-3.5 bg-[#0f172a] border border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-white transition-all"
                                        onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                                    />
                                </div>
                            </div>

                            {/* Website */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-400">Website URL</label>
                                <div className="relative">
                                    <GlobeAltIcon className="absolute left-3 top-3.5 size-5 text-slate-500" />
                                    <input 
                                        type="url" 
                                        value={formData.company_website}
                                        className="pl-10 w-full p-3.5 bg-[#0f172a] border border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-white transition-all"
                                        onChange={(e) => setFormData({...formData, company_website: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-400">Company Bio</label>
                            <textarea 
                                value={formData.company_bio}
                                className="w-full p-4 bg-[#0f172a] border border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-white transition-all"
                                rows="4" 
                                onChange={(e) => setFormData({...formData, company_bio: e.target.value})}
                            ></textarea>
                        </div>
                    </div>

                    <div className="p-8 bg-[#1e293b] border-t border-slate-700/50 flex justify-end">
                        <button 
                            type="submit" 
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3.5 px-12 rounded-2xl shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-1"
                        >
                            {isExisting ? 'Update Profile' : 'Save Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RecruiterProfile;