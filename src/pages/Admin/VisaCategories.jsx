import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Plus, Trash2, Edit3, Search, Hash } from 'lucide-react';

const VisaCategories = () => {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const fetchCats = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/visa-categories');
            setCategories(res.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchCats(); }, []);

    // --- ADD FUNCTION ---
    const handleAdd = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        try {
            const res = await axios.post('http://localhost:5000/api/admin/visa-categories', { category_name: name });
            if (res.data.success) {
                Swal.fire({ icon: 'success', title: 'Added!', showConfirmButton: false, timer: 1000 });
                setName("");
                fetchCats();
            }
        } catch (err) { Swal.fire('Error', 'Failed to add', 'error'); }
    };

    // --- DELETE FUNCTION ---
    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "This category will be permanently removed!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Yes, delete it!',
            background: '#ffffff',
            customClass: { popup: 'rounded-[30px]' }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axios.delete(`http://localhost:5000/api/admin/visa-categories/${id}`);
                    if (res.data.success) {
                        Swal.fire('Deleted!', 'Category has been removed.', 'success');
                        fetchCats();
                    }
                } catch (err) { Swal.fire('Error', 'Delete failed', 'error'); }
            }
        });
    };

    // --- EDIT FUNCTION ---
    const handleEdit = async (cat) => {
        Swal.fire({
            title: 'Edit Category',
            input: 'text',
            inputValue: cat.category_name,
            showCancelButton: true,
            confirmButtonText: 'Update',
            confirmButtonColor: '#EF4444',
            inputValidator: (value) => {
                if (!value) return 'You need to write something!';
            },
            customClass: { popup: 'rounded-[30px]', input: 'rounded-xl border-gray-200' }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axios.put(`http://localhost:5000/api/admin/visa-categories/${cat.id}`, { 
                        category_name: result.value 
                    });
                    if (res.data.success) {
                        Swal.fire('Updated!', 'Category name updated.', 'success');
                        fetchCats();
                    }
                } catch (err) { Swal.fire('Error', 'Update failed', 'error'); }
            }
        });
    };

    // Search filter
    const filteredCats = categories.filter(c => 
        c.category_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter">Visa <span className="text-red-600">Categories</span></h2>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[3px] mt-1">Total: {categories.length} Types</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    {/* Search Bar */}
                    <div className="relative group">
                        <Search className="absolute left-4 top-3.5 text-gray-400 group-hover:text-red-500 transition-colors" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search categories..." 
                            className="pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-xs w-full sm:w-64 focus:ring-2 focus:ring-red-500/20 transition-all outline-none font-bold"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Add Form */}
                    <form onSubmit={handleAdd} className="flex gap-2">
                        <input 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            type="text" 
                            placeholder="New Category..." 
                            className="p-3 bg-gray-50 border-none rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-red-500/20 w-full" 
                            required 
                        />
                        <button className="bg-red-600 text-white p-3.5 rounded-2xl hover:bg-black hover:rotate-12 transition-all shadow-lg shadow-red-500/20">
                            <Plus size={20}/>
                        </button>
                    </form>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest italic"><div className="flex items-center gap-2"><Hash size={12}/> SL</div></th>
                                <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest italic">Category Identity</th>
                                <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest italic text-right">Actions Control</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredCats.map((cat, i) => (
                                <tr key={cat.id} className="group hover:bg-gray-50/80 transition-all">
                                    <td className="p-6">
                                        <span className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-xs font-black text-gray-500 group-hover:bg-red-50 group-hover:text-red-600 transition-colors">
                                            {i + 1}
                                        </span>
                                    </td>
                                    <td className="p-6 font-black uppercase italic text-gray-700 tracking-tight text-sm">
                                        {cat.category_name}
                                    </td>
                                    <td className="p-6">
                                        <div className="flex justify-end gap-3">
                                            <button 
                                                onClick={() => handleEdit(cat)}
                                                className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white hover:-translate-y-1 transition-all duration-300 shadow-sm"
                                            >
                                                <Edit3 size={16}/>
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(cat.id)}
                                                className="p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white hover:-translate-y-1 transition-all duration-300 shadow-sm"
                                            >
                                                <Trash2 size={16}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredCats.length === 0 && (
                        <div className="p-20 text-center">
                            <p className="text-xs font-black uppercase tracking-[5px] text-gray-300 italic">No Categories Found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VisaCategories;