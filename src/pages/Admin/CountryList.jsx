import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Globe, Plus, Trash2, Edit3, Power, Star, Upload, Image as ImageIcon } from 'lucide-react';

const CountryList = () => {
    const [countries, setCountries] = useState([]);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({ name: '', categoryId: '', charge: '' });
    const [file, setFile] = useState(null); // Image file state

    const fetchData = async () => {
        try {
            const countryRes = await axios.get('http://localhost:5000/api/admin/visa-countries');
            const categoryRes = await axios.get('http://localhost:5000/api/admin/visa-categories');
            setCountries(countryRes.data);
            setCategories(categoryRes.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchData(); }, []);

    // --- Toggle Top Suggestion ---
    const handleToggleTop = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 1 ? 0 : 1;
            await axios.put(`http://localhost:5000/api/admin/visa-countries/toggle-top/${id}`, { is_top: newStatus });
            fetchData();
            const Toast = Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
            Toast.fire({ icon: 'success', title: newStatus ? 'Added to Top Offers' : 'Removed from Top' });
        } catch (err) { Swal.fire('Error', 'Failed to update priority', 'error'); }
    };

    // --- Add Country with Image ---
    const handleAddCountry = async (e) => {
    e.preventDefault();
    
    // Check koren category select kora hoyeche ki na
    if(!formData.categoryId) return Swal.fire('Error', 'Please select a category', 'error');

    const data = new FormData();
    data.append('country_name', formData.name);
    data.append('category_id', formData.categoryId);
    data.append('application_charge', formData.charge);
    
    if (file) {
        data.append('image', file); 
    }

    try {
        await axios.post('http://localhost:5000/api/admin/visa-countries', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        Swal.fire({ icon: 'success', title: 'Success!', timer: 1000, showConfirmButton: false });
        
        // --- State Reset (Important) ---
        setFormData({ name: '', categoryId: '', charge: '' });
        setFile(null); 
        fetchData();
    } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Failed to add country', 'error');
    }
};

    // (handleEditPrice, toggleStatus, handleDelete functions remain the same as your previous code)
    const handleEditPrice = (country) => {
        Swal.fire({
            title: `Update Price for ${country.country_name}`,
            input: 'number',
            inputValue: country.application_charge,
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            customClass: { popup: 'rounded-[30px]' }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.put(`http://localhost:5000/api/admin/visa-countries/price/${country.id}`, { application_charge: result.value });
                    fetchData();
                } catch (err) { console.error(err); }
            }
        });
    };

    const toggleStatus = async (country) => {
        const newStatus = country.status === 'active' ? 'inactive' : 'active';
        try {
            await axios.put(`http://localhost:5000/api/admin/visa-countries/status/${country.id}`, { status: newStatus });
            fetchData();
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        Swal.fire({ title: 'Delete?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#000' }).then(async (res) => {
            if (res.isConfirmed) {
                await axios.delete(`http://localhost:5000/api/admin/visa-countries/${id}`);
                fetchData();
            }
        });
    };

    return (
        <div className="space-y-8 p-4 bg-gray-50/50 min-h-screen">
            {/* 🏗️ ADD CONFIG FORM */}
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-red-100 text-red-600 rounded-2xl"><Plus size={20}/></div>
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter">New Visa <span className="text-red-600">Config</span></h2>
                </div>
                
                <form onSubmit={handleAddCountry} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase ml-2 text-gray-400">Country</label>
                        <input value={formData.name} onChange={(e)=>setFormData({...formData, name:e.target.value})} placeholder="e.g. Poland" className="w-full p-3 bg-gray-50 border-none rounded-2xl text-xs font-bold focus:ring-2 ring-red-500 transition-all" required />
                    </div>
                    
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase ml-2 text-gray-400">Visa Type</label>
                        <select value={formData.categoryId} onChange={(e)=>setFormData({...formData, categoryId:e.target.value})} className="w-full p-3 bg-gray-50 border-none rounded-2xl text-xs font-bold appearance-none" required>
                            <option value="">Select Category</option>
                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.category_name}</option>)}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase ml-2 text-gray-400">Charge ($)</label>
                        <input value={formData.charge} onChange={(e)=>setFormData({...formData, charge:e.target.value})} placeholder="500" type="number" className="w-full p-3 bg-gray-50 border-none rounded-2xl text-xs font-bold" required />
                    </div>

                    {/* 📸 IMAGE UPLOAD INPUT */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase ml-2 text-gray-400">Country Banner</label>
                        <label className="flex items-center justify-center gap-2 p-3 bg-blue-50 text-blue-600 rounded-2xl cursor-pointer hover:bg-blue-100 transition-all border-2 border-dashed border-blue-200">
                            <Upload size={16} />
                            <span className="text-[10px] font-black uppercase tracking-tighter">{file ? 'Selected' : 'Upload'}</span>
                            <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} accept="image/*" />
                        </label>
                    </div>

                    <button className="bg-black text-white p-4 rounded-2xl hover:bg-red-600 transition-all font-black text-[10px] uppercase italic tracking-widest">Create Offer</button>
                </form>
            </div>

            {/* 🌍 COUNTRIES GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {countries.map((country) => (
                    <div key={country.id} className="bg-white rounded-[40px] shadow-sm border border-gray-100 group hover:shadow-2xl transition-all duration-500 relative overflow-hidden flex flex-col h-full">
                        
                        {/* Image Preview Header */}
                        <div className="h-40 w-full relative overflow-hidden">
                            {country.image_url ? (
                                    <img 
                                        src={`http://localhost:5000${country.image_url}`} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                        alt={country.country_name} 
                                    />
                                ) : (
                                    <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                                        <ImageIcon size={40}/>
                                    </div>
                                )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            
                            {/* TOP TOGGLE BUTTON */}
                            <button 
                                onClick={() => handleToggleTop(country.id, country.is_top)}
                                className={`absolute top-4 right-4 p-3 rounded-2xl backdrop-blur-md transition-all shadow-lg ${country.is_top ? 'bg-yellow-400 text-black scale-110' : 'bg-black/20 text-white hover:bg-white hover:text-black'}`}
                            >
                                <Star size={18} fill={country.is_top ? "black" : "none"} />
                            </button>
                        </div>

                        <div className="p-7 relative z-10 flex-grow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-2xl font-black italic uppercase text-gray-900 leading-none tracking-tighter">{country.country_name}</h3>
                                    <span className="mt-2 inline-block px-3 py-1 bg-red-600 text-white rounded-lg text-[9px] font-black uppercase italic tracking-widest">{country.category_name}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => toggleStatus(country)} className={`p-2 rounded-xl ${country.status === 'active' ? 'text-green-500 bg-green-50' : 'text-gray-300 bg-gray-50'}`}><Power size={18}/></button>
                                    <button onClick={() => handleDelete(country.id)} className="p-2 text-gray-300 hover:text-red-600 bg-gray-50 rounded-xl"><Trash2 size={18}/></button>
                                </div>
                            </div>

                            <div className="mt-8 flex items-end justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Price Start From</span>
                                    <div className="flex items-center gap-1 text-4xl font-black text-slate-900 italic leading-none">
                                        <span className="text-sm text-red-600 font-bold not-italic">$</span>{country.application_charge}
                                    </div>
                                </div>
                                <button onClick={() => handleEditPrice(country)} className="p-4 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"><Edit3 size={20}/></button>
                            </div>
                        </div>

                        {/* Footer Status Bar */}
                        <div className={`py-3 px-7 border-t border-gray-50 flex items-center justify-between ${country.is_top ? 'bg-yellow-50' : 'bg-transparent'}`}>
                             <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${country.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                                <span className="text-[10px] font-black uppercase italic tracking-widest text-gray-500">{country.status}</span>
                             </div>
                             {country.is_top === 1 && <span className="text-[9px] font-black text-yellow-600 uppercase italic tracking-tighter">★ Top Featured</span>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CountryList;