import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Plane, MapPin, DollarSign, Clock, Trash2, Plus, Star, Zap } from 'lucide-react';

const TourManager = () => {
    const [packages, setPackages] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ 
        title: '', 
        destination: '', 
        price: '', 
        duration: '', 
        description: '', 
        image_url: '' 
    });

    const fetchPackages = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/tours/packages');
            setPackages(res.data);
        } catch (err) {
            console.error("Fetch Error:", err);
        }
    };

    useEffect(() => { fetchPackages(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/tours/add-package', formData);
            Swal.fire({
                title: 'Success',
                text: 'New Tour Package Live!',
                icon: 'success',
                confirmButtonColor: '#dc2626'
            });
            setShowForm(false);
            fetchPackages();
            setFormData({ title: '', destination: '', price: '', duration: '', description: '', image_url: '' });
        } catch (err) { 
            Swal.fire('Error', 'Failed to add package', 'error'); 
        }
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#000',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.delete(`http://localhost:5000/api/tours/package/${id}`);
                fetchPackages();
                Swal.fire('Deleted!', 'Package has been removed.', 'success');
            }
        });
    };

    // --- NEW TOGGLE TOP LOGIC ---
    const handleToggleTop = async (id) => {
        try {
            const res = await axios.put(`http://localhost:5000/api/tours/package/toggle-top/${id}`);
            Swal.fire({
                title: 'Status Updated',
                text: res.data.message,
                icon: 'success',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
            });
            fetchPackages(); 
        } catch (err) {
            Swal.fire('Error', 'Failed to update top status', 'error');
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4 space-y-8 animate-in fade-in duration-700">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-10 rounded-[50px] shadow-xl shadow-slate-200/50 border border-gray-50 gap-6">
                <div className="text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                        <Zap size={18} className="text-red-600 fill-red-600" />
                        <span className="text-[10px] font-black text-red-600 uppercase tracking-[4px]">Admin Console</span>
                    </div>
                    <h2 className="text-4xl font-black italic uppercase text-slate-900 tracking-tighter">
                        Tour <span className="text-red-600 underline decoration-black decoration-4">Packages</span>
                    </h2>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[2px] mt-2 italic">Control world-class travel experiences from here</p>
                </div>
                <button 
                    onClick={() => setShowForm(!showForm)} 
                    className={`flex items-center gap-3 px-10 py-5 rounded-3xl font-black italic uppercase text-xs transition-all duration-500 shadow-2xl active:scale-95 ${
                        showForm ? "bg-red-600 text-white" : "bg-black text-white hover:bg-red-600"
                    }`}
                >
                    {showForm ? <Trash2 size={16}/> : <Plus size={16}/>}
                    {showForm ? "Cancel Entry" : "Add New Package"}
                </button>
            </div>

            {/* Form Section */}
            {showForm && (
                <div className="bg-white p-10 rounded-[50px] shadow-2xl border-[6px] border-black animate-in slide-in-from-top duration-500">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase ml-4">Package Title</label>
                            <input type="text" placeholder="e.g. Luxury Maldives Trip" className="w-full p-5 bg-gray-50 rounded-3xl font-bold border-2 border-transparent focus:border-red-600 outline-none transition-all" value={formData.title} onChange={(e)=>setFormData({...formData, title: e.target.value})} required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase ml-4">Destination</label>
                            <input type="text" placeholder="e.g. Bali, Indonesia" className="w-full p-5 bg-gray-50 rounded-3xl font-bold border-2 border-transparent focus:border-red-600 outline-none transition-all" value={formData.destination} onChange={(e)=>setFormData({...formData, destination: e.target.value})} required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase ml-4">Price ($)</label>
                            <input type="number" placeholder="999" className="w-full p-5 bg-gray-50 rounded-3xl font-bold border-2 border-transparent focus:border-red-600 outline-none transition-all" value={formData.price} onChange={(e)=>setFormData({...formData, price: e.target.value})} required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase ml-4">Duration</label>
                            <input type="text" placeholder="e.g. 5 Days / 4 Nights" className="w-full p-5 bg-gray-50 rounded-3xl font-bold border-2 border-transparent focus:border-red-600 outline-none transition-all" value={formData.duration} onChange={(e)=>setFormData({...formData, duration: e.target.value})} required />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black uppercase ml-4">Image URL</label>
                            <input type="text" placeholder="https://unsplash.com/your-image-link" className="w-full p-5 bg-gray-50 rounded-3xl font-bold border-2 border-transparent focus:border-red-600 outline-none transition-all" value={formData.image_url} onChange={(e)=>setFormData({...formData, image_url: e.target.value})} />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black uppercase ml-4">Description</label>
                            <textarea placeholder="Write a compelling story about this trip..." className="w-full p-5 bg-gray-50 rounded-3xl font-bold h-32 border-2 border-transparent focus:border-red-600 outline-none transition-all resize-none" value={formData.description} onChange={(e)=>setFormData({...formData, description: e.target.value})}></textarea>
                        </div>
                        <button className="md:col-span-2 bg-red-600 text-white p-6 rounded-3xl font-black uppercase italic tracking-[4px] hover:bg-black transition-all shadow-xl shadow-red-600/20">Launch Package to Live</button>
                    </form>
                </div>
            )}

            {/* Grid List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {packages.map((pkg) => (
                    <div key={pkg.id} className="bg-white rounded-[50px] shadow-lg overflow-hidden border border-gray-100 group relative hover:shadow-2xl transition-all duration-500">
                        
                        {/* STAR TOGGLE BUTTON */}
                        <button 
                            onClick={() => handleToggleTop(pkg.id)}
                            className={`absolute top-6 right-6 z-20 p-4 rounded-3xl transition-all duration-500 shadow-2xl hover:scale-110 active:scale-90 ${
                                pkg.is_top === 1 
                                ? 'bg-yellow-400 text-white scale-105 rotate-12' 
                                : 'bg-white/90 backdrop-blur-md text-gray-400 hover:text-yellow-500'
                            }`}
                        >
                            <Star size={20} fill={pkg.is_top === 1 ? "white" : "none"} strokeWidth={2.5} />
                        </button>

                        <div className="h-64 bg-slate-200 relative overflow-hidden">
                             <img 
                                src={pkg.image_url || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                                alt="" 
                             />
                             {/* Floating Price Badge */}
                             <div className="absolute bottom-6 left-6 bg-black text-white px-6 py-2 rounded-2xl font-black text-sm italic uppercase tracking-widest shadow-2xl">
                                ${pkg.price}
                             </div>
                             {pkg.is_top === 1 && (
                                <div className="absolute top-6 left-6 bg-red-600 text-white px-4 py-1 rounded-full font-black text-[9px] uppercase tracking-widest animate-pulse">
                                    TOP Pick
                                </div>
                             )}
                        </div>

                        <div className="p-8">
                            <h3 className="text-2xl font-black italic uppercase text-slate-900 tracking-tighter leading-none mb-4">
                                {pkg.title}
                            </h3>
                            
                            <div className="flex flex-wrap items-center gap-4 text-gray-400 font-bold text-[10px] uppercase italic mb-8">
                                <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full text-red-600 border border-red-50">
                                    <MapPin size={12} strokeWidth={3}/> {pkg.destination}
                                </span>
                                <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full text-slate-900 border border-slate-100">
                                    <Clock size={12} strokeWidth={3}/> {pkg.duration}
                                </span>
                            </div>

                            <div className="flex gap-3">
                                <button 
                                    onClick={() => handleDelete(pkg.id)} 
                                    className="flex-1 flex items-center justify-center gap-2 bg-gray-50 text-gray-400 py-4 rounded-3xl hover:bg-red-50 hover:text-red-600 transition-all font-black uppercase italic text-[10px] tracking-widest border border-transparent hover:border-red-100"
                                >
                                    <Trash2 size={16}/> Remove
                                </button>
                                <div className="p-4 bg-slate-900 text-white rounded-3xl cursor-pointer hover:bg-red-600 transition-colors">
                                    <Plane size={16} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {packages.length === 0 && (
                <div className="bg-white p-20 rounded-[50px] border-4 border-dashed border-gray-100 text-center">
                    <Plane size={48} className="mx-auto text-gray-200 mb-4 animate-bounce" />
                    <h3 className="text-xl font-black uppercase italic text-gray-400">Packages Empty</h3>
                </div>
            )}
        </div>
    );
};

export default TourManager;