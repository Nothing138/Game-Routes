import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Plus, Trash2, Edit } from 'lucide-react';

const VisaCategories = () => {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");

    // Database theke data ana
    const fetchCats = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/visa-categories');
            setCategories(res.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchCats(); }, []);

    const handleAdd = async (e) => {
    e.preventDefault();
    if(!name.trim()) return; // Khali thakle jabe na

    try {
        // 'name' variable ke 'category_name' hishebe pathano
        const res = await axios.post('http://localhost:5000/api/admin/visa-categories', { 
            category_name: name 
        });

        if(res.data.success) {
            Swal.fire({
                icon: 'success',
                title: 'Done!',
                text: 'Category added successfully',
                timer: 1500
            });
            setName(""); // Input clear kora
            fetchCats(); // List refresh kora
        }
    } catch (err) {
        console.error("FULL ERROR:", err.response?.data || err.message); // Eita console-e check koren
        Swal.fire('Error', err.response?.data?.error || 'Failed to add', 'error');
    }
};

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-[30px] shadow-sm flex justify-between items-center">
                <h2 className="text-xl font-black italic uppercase">Visa <span className="text-red-600">Categories</span></h2>
                <form onSubmit={handleAdd} className="flex gap-2">
                    <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="e.g., Work Permit" className="p-3 border rounded-xl text-xs" required />
                    <button className="bg-red-600 text-white p-3 rounded-xl hover:bg-black transition-all"><Plus size={18}/></button>
                </form>
            </div>

            <div className="bg-white rounded-[30px] shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-[10px] font-black uppercase text-gray-400 italic border-b">
                        <tr>
                            <th className="p-5">SL</th>
                            <th className="p-5">Category Name</th>
                            <th className="p-5 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {categories.map((cat, i) => (
                            <tr key={cat.id} className="hover:bg-gray-50 transition-all">
                                <td className="p-5 text-gray-400 font-bold">{i + 1}</td>
                                <td className="p-5 font-black uppercase italic text-gray-700">{cat.category_name}</td>
                                <td className="p-5 flex justify-end gap-2">
                                    <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit size={14}/></button>
                                    <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={14}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VisaCategories;