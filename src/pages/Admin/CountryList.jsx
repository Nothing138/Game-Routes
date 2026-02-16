import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Globe, Plus, DollarSign, Trash2, Layers, MapPin, Edit3, Power } from 'lucide-react';

const CountryList = () => {
    const [countries, setCountries] = useState([]);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({ name: '', categoryId: '', charge: '' });

    const fetchData = async () => {
        try {
            const countryRes = await axios.get('http://localhost:5000/api/admin/visa-countries');
            const categoryRes = await axios.get('http://localhost:5000/api/admin/visa-categories');
            setCountries(countryRes.data);
            setCategories(categoryRes.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchData(); }, []);

    // --- Price Update ---
    const handleEditPrice = (country) => {
        Swal.fire({
            title: `Update Price for ${country.country_name}`,
            text: `Category: ${country.category_name}`,
            input: 'number',
            inputValue: country.application_charge,
            showCancelButton: true,
            confirmButtonText: 'Update Charge',
            confirmButtonColor: '#EF4444',
            customClass: { popup: 'rounded-[30px]' }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.put(`http://localhost:5000/api/admin/visa-countries/price/${country.id}`, {
                        application_charge: result.value
                    });
                    Swal.fire('Updated!', 'New price set successfully.', 'success');
                    fetchData();
                } catch (err) { Swal.fire('Error', 'Update failed', 'error'); }
            }
        });
    };

    // --- Status Toggle ---
    const toggleStatus = (country) => {
        const newStatus = country.status === 'active' ? 'inactive' : 'active';
        Swal.fire({
            title: `Are you sure?`,
            text: `Do you want to ${newStatus === 'active' ? 'Activate' : 'Deactivate'} this service?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: newStatus === 'active' ? '#10B981' : '#EF4444',
            confirmButtonText: `Yes, ${newStatus}!`,
            customClass: { popup: 'rounded-[30px]' }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.put(`http://localhost:5000/api/admin/visa-countries/status/${country.id}`, { status: newStatus });
                    Swal.fire('Success!', `Service is now ${newStatus}.`, 'success');
                    fetchData();
                } catch (err) { Swal.fire('Error', 'Status change failed', 'error'); }
            }
        });
    };

    // --- Delete Configuration ---
    const handleDelete = (id) => {
        Swal.fire({
            title: 'Delete Permanently?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#000000',
            cancelButtonColor: '#EF4444',
            confirmButtonText: 'Yes, Delete!',
            customClass: { popup: 'rounded-[30px]' }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:5000/api/admin/visa-countries/${id}`);
                    Swal.fire('Deleted!', 'Configuration removed.', 'success');
                    fetchData();
                } catch (err) { Swal.fire('Error', 'Delete failed', 'error'); }
            }
        });
    };

    const handleAddCountry = async (e) => {
        e.preventDefault();
        if(!formData.categoryId) {
            return Swal.fire('Error', 'Please select a visa category!', 'error');
        }
        try {
            await axios.post('http://localhost:5000/api/admin/visa-countries', {
                country_name: formData.name,
                category_id: formData.categoryId,
                application_charge: formData.charge
            });
            Swal.fire({ icon: 'success', title: 'Added!', timer: 1000, showConfirmButton: false });
            setFormData({ name: '', categoryId: '', charge: '' });
            fetchData();
        } catch (err) { Swal.fire('Error', 'Failed to add', 'error'); }
    };

    return (
        <div className="space-y-8 p-4">
            {/* Header & Add Form (Remains same but polished) */}
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-6">Visa <span className="text-red-600">Pricing Engine</span></h2>
                <form onSubmit={handleAddCountry} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input value={formData.name} onChange={(e)=>setFormData({...formData, name:e.target.value})} placeholder="Country Name" className="p-3 bg-gray-50 border-none rounded-2xl text-xs font-bold" required />
                    <select value={formData.categoryId} onChange={(e)=>setFormData({...formData, categoryId:e.target.value})} className="p-3 bg-gray-50 border-none rounded-2xl text-xs font-bold appearance-none" required>
                        <option value="">Select Category</option>
                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.category_name}</option>)}
                    </select>
                    <input value={formData.charge} onChange={(e)=>setFormData({...formData, charge:e.target.value})} placeholder="Charge ($)" type="number" className="p-3 bg-gray-50 border-none rounded-2xl text-xs font-bold" required />
                    <button className="bg-red-600 text-white p-3 rounded-2xl hover:bg-black transition-all font-black text-[10px] uppercase italic">Add Config</button>
                </form>
            </div>

            {/* Countries Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {countries.map((country) => (
                    <div key={country.id} className="bg-white p-7 rounded-[40px] shadow-sm border border-gray-100 group hover:shadow-2xl hover:bg-slate-50/50 transition-all duration-500 relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all duration-500 shadow-inner">
                                    <Globe size={28}/>
                                </div>
                                <div className="flex gap-1">
                                    <button onClick={() => toggleStatus(country)} title="Toggle Status" className={`p-2 rounded-xl transition-colors ${country.status === 'active' ? 'text-green-500 hover:bg-green-100' : 'text-gray-300 hover:bg-gray-100'}`}>
                                        <Power size={18}/>
                                    </button>
                                    <button onClick={() => handleDelete(country.id)} className="p-2 text-gray-300 hover:text-red-600 transition-colors">
                                        <Trash2 size={18}/>
                                    </button>
                                </div>
                            </div>

                            {/* Country and Category Display */}
                            <div>
                                <h3 className="text-2xl font-black italic uppercase text-gray-900 leading-none tracking-tighter">
                                    {country.country_name}
                                </h3>
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="px-3 py-1 bg-red-600 text-white rounded-lg text-[9px] font-black uppercase italic tracking-widest shadow-md shadow-red-500/20">
                                        {country.category_name || "Uncategorized"}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Pricing Display */}
                            <div className="mt-8 flex items-end justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Service Charge</span>
                                    <div className="flex items-center gap-1 text-4xl font-black text-slate-900 italic leading-none">
                                        <span className="text-sm text-red-600 font-bold not-italic">$</span>{country.application_charge}
                                    </div>
                                </div>
                                <button onClick={() => handleEditPrice(country)} className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white hover:rotate-12 transition-all shadow-sm">
                                    <Edit3 size={20}/>
                                </button>
                            </div>

                            <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full animate-pulse ${country.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <span className={`text-[10px] font-black uppercase italic tracking-[2px] ${country.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                                        {country.status}
                                    </span>
                                </div>
                                <button onClick={() => handleEditPrice(country)} className="text-[10px] font-black uppercase text-gray-400 hover:text-red-600 transition-colors tracking-tighter">
                                    Manage Settings
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CountryList;