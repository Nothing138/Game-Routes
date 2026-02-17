import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Plane, MapPin, DollarSign, Clock, Trash2, Plus } from 'lucide-react';

const TourManager = () => {
    const [packages, setPackages] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ title: '', destination: '', price: '', duration: '', description: '', image_url: '' });

    const fetchPackages = async () => {
        const res = await axios.get('http://localhost:5000/api/tours/packages');
        setPackages(res.data);
    };

    useEffect(() => { fetchPackages(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/tours/add-package', formData);
            Swal.fire('Success', 'New Tour Package Live!', 'success');
            setShowForm(false);
            fetchPackages();
        } catch (err) { Swal.fire('Error', 'Failed to add', 'error'); }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this package?")) {
            await axios.delete(`http://localhost:5000/api/tours/package/${id}`);
            fetchPackages();
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex justify-between items-center bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                <div>
                    <h2 className="text-3xl font-black italic uppercase text-slate-900 tracking-tighter">Tour <span className="text-red-600">Inventory</span></h2>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[3px] mt-1 italic">Create and manage world-class travel experiences</p>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="bg-black text-white px-8 py-4 rounded-2xl font-black italic uppercase text-xs hover:bg-red-600 transition-all shadow-xl">
                   {showForm ? "Close" : "Add Package"}
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[40px] shadow-2xl border-4 border-black grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Package Title" className="p-4 bg-gray-50 rounded-2xl font-bold" onChange={(e)=>setFormData({...formData, title: e.target.value})} required />
    <input type="text" placeholder="Destination" className="p-4 bg-gray-50 rounded-2xl font-bold" onChange={(e)=>setFormData({...formData, destination: e.target.value})} required />
    <input type="number" placeholder="Price ($)" className="p-4 bg-gray-50 rounded-2xl font-bold" onChange={(e)=>setFormData({...formData, price: e.target.value})} required />
    <input type="text" placeholder="Duration (e.g. 5 Days)" className="p-4 bg-gray-50 rounded-2xl font-bold" onChange={(e)=>setFormData({...formData, duration: e.target.value})} required />
    <input type="text" placeholder="Image URL (Unsplash Link)" className="md:col-span-2 p-4 bg-gray-50 rounded-2xl font-bold" onChange={(e)=>setFormData({...formData, image_url: e.target.value})} />
    <textarea placeholder="Description" className="md:col-span-2 p-4 bg-gray-50 rounded-2xl font-bold h-32" onChange={(e)=>setFormData({...formData, description: e.target.value})}></textarea>
    <button className="md:col-span-2 bg-red-600 text-white p-4 rounded-2xl font-black uppercase italic tracking-widest hover:bg-black transition-all">Launch Package</button>
                </form>
            )}

            {/* Grid List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                    <div key={pkg.id} className="bg-white rounded-[40px] shadow-sm overflow-hidden border border-gray-100 group">
                        <div className="h-48 bg-slate-200 relative overflow-hidden">
                             <img src={pkg.image_url || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                             <div className="absolute top-4 left-4 bg-black text-white px-4 py-1 rounded-full font-black text-[10px] italic uppercase tracking-widest">${pkg.price}</div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-black italic uppercase text-slate-900 tracking-tight">{pkg.title}</h3>
                            <div className="flex items-center gap-4 mt-3 text-gray-400 font-bold text-[11px] uppercase italic">
                                <span className="flex items-center gap-1 text-red-600"><MapPin size={12}/> {pkg.destination}</span>
                                <span className="flex items-center gap-1 text-slate-900"><Clock size={12}/> {pkg.duration}</span>
                            </div>
                            <button onClick={() => handleDelete(pkg.id)} className="w-full mt-6 flex items-center justify-center gap-2 bg-gray-50 text-gray-400 py-3 rounded-2xl hover:bg-red-50 hover:text-red-600 transition-all font-black uppercase italic text-[10px] tracking-widest">
                                <Trash2 size={14}/> Remove Package
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TourManager;