import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Globe, Plus, DollarSign } from 'lucide-react';

const CountryList = () => {
    const [countries, setCountries] = useState([]);
    const [formData, setFormData] = useState({ name: '', charge: '' });

    const fetchCountries = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/visa-countries');
            setCountries(res.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchCountries(); }, []);

    const handleAddCountry = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/admin/visa-countries', {
                country_name: formData.name,
                application_charge: formData.charge
            });
            Swal.fire('Success', 'Country Added!', 'success');
            setFormData({ name: '', charge: '' });
            fetchCountries();
        } catch (err) { Swal.fire('Error', 'Failed to add', 'error'); }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-[30px] shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-xl font-black italic uppercase">Manage <span className="text-red-600">Countries</span></h2>
                <form onSubmit={handleAddCountry} className="flex flex-wrap gap-2">
                    <input value={formData.name} onChange={(e)=>setFormData({...formData, name:e.target.value})} placeholder="Country Name" className="p-3 border rounded-xl text-xs w-40" required />
                    <input value={formData.charge} onChange={(e)=>setFormData({...formData, charge:e.target.value})} placeholder="Charge ($)" type="number" className="p-3 border rounded-xl text-xs w-24" required />
                    <button className="bg-red-600 text-white px-4 py-3 rounded-xl hover:bg-black transition-all flex items-center gap-2 text-xs font-bold uppercase"><Plus size={16}/> Add</button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {countries.map((country) => (
                    <div key={country.id} className="bg-white p-6 rounded-[35px] shadow-sm border border-gray-100 group hover:bg-slate-900 transition-all duration-300">
                        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-red-600 group-hover:text-white transition-all">
                            <Globe size={24}/>
                        </div>
                        <h3 className="text-lg font-black italic uppercase group-hover:text-white">{country.country_name}</h3>
                        <div className="flex items-center gap-2 mt-2 text-red-600 font-black italic">
                            <DollarSign size={14}/> <span>{country.application_charge}</span>
                        </div>
                        <div className={`mt-4 inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase italic ${country.status === 'active' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
                            {country.status}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CountryList;