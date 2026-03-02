import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { 
  Upload, User, Briefcase, FileText, Trash2, 
  Search, ArrowUpDown, Filter, ChevronLeft, ChevronRight, 
  Image as ImageIcon, CheckCircle, Plus
} from 'lucide-react';

const API_BASE = "http://localhost:5000";

const TestimonyManagement = () => {
  // --- States ---
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Form States
  const [formData, setFormData] = useState({ name: '', designation: '', description: '' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // Table States (Filtering/Sorting/Pagination)
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'desc' });

  // --- Fetch Data ---
  const fetchStories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/testimonials`);
      setStories(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStories(); }, []);

  // --- Handlers ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return Swal.fire('Error', 'Please select an image', 'error');

    setUploading(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('designation', formData.designation);
    data.append('description', formData.description);
    data.append('image', image);

    try {
      await axios.post(`${API_BASE}/api/testimonials`, data);
      Swal.fire('Success', 'Testimony uploaded!', 'success');
      setFormData({ name: '', designation: '', description: '' });
      setImage(null);
      setPreview(null);
      fetchStories(); // Refresh list
    } catch (err) {
      Swal.fire('Error', 'Failed to upload', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_BASE}/api/testimonials/${id}`);
        Swal.fire('Deleted!', 'Record removed.', 'success');
        fetchStories();
      } catch (err) { console.error(err); }
    }
  };

  // --- Logic for Filtering, Sorting & Pagination ---
  const processedData = useMemo(() => {
    let filtered = stories.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.designation.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [stories, searchTerm, sortConfig]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = processedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(processedData.length / itemsPerPage);

  return (
    <div className="space-y-10">
      {/* 🚀 TOP SECTION: UPLOAD FORM */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-500/20">
            <Plus size={24} />
          </div>
          <h2 className="text-2xl font-black italic uppercase tracking-tight dark:text-white">Upload New <span className="text-blue-600">Testimony</span></h2>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Inputs */}
          <div className="lg:col-span-2 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative">
                <User className="absolute left-4 top-4 text-slate-400" size={18} />
                <input 
                  type="text" placeholder="Full Name" required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="relative">
                <Briefcase className="absolute left-4 top-4 text-slate-400" size={18} />
                <input 
                  type="text" placeholder="Designation (e.g. Student)"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
                  value={formData.designation} onChange={(e) => setFormData({...formData, designation: e.target.value})}
                />
              </div>
            </div>
            <div className="relative">
              <FileText className="absolute left-4 top-4 text-slate-400" size={18} />
              <textarea 
                placeholder="Share the success story details..." required rows="4"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
                value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>

          {/* Image Upload Area */}
          <div className="space-y-5">
            <div className="relative group h-[190px] rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/50 hover:bg-white transition-all overflow-hidden">
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <>
                  <ImageIcon size={32} className="text-slate-300 mb-2" />
                  <p className="text-[10px] font-bold uppercase text-slate-400">Click to Upload Image</p>
                </>
              )}
              <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
            </div>
            <button 
              type="submit" disabled={uploading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              {uploading ? "Uploading..." : <><CheckCircle size={16}/> Publish Testimony</>}
            </button>
          </div>
        </form>
      </div>

      {/* 📊 BOTTOM SECTION: DATA TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-xl font-black italic uppercase dark:text-white">Existing <span className="text-red-600">Stories</span></h3>
          
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" placeholder="Search by name or role..."
              className="pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none outline-none ring-1 ring-slate-200 dark:ring-slate-700 w-full md:w-72 text-sm dark:text-white"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-[11px] font-black uppercase tracking-widest text-slate-500">
              <tr>
                <th className="px-8 py-5">Client Info</th>
                <th className="px-8 py-5">Description</th>
                <th className="px-8 py-5 cursor-pointer hover:text-blue-600" onClick={() => setSortConfig({ key: 'id', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'})}>
                   Date <ArrowUpDown size={12} className="inline ml-1"/>
                </th>
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {currentItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <img src={`${API_BASE}${item.image_url}`} className="w-12 h-12 rounded-xl object-cover shadow-md" alt="" />
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-sm">{item.name}</p>
                        <p className="text-[10px] text-blue-600 font-bold uppercase tracking-tight">{item.designation}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 max-w-[300px]">
                    <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2 italic">"{item.description}"</p>
                  </td>
                  <td className="px-8 py-6 text-xs text-slate-400 font-medium">
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button onClick={() => handleDelete(item.id)} className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-6 bg-slate-50 dark:bg-slate-800/30 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs font-bold text-slate-400 uppercase">Page {currentPage} of {totalPages}</p>
          <div className="flex gap-2">
            <button 
              disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}
              className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-50 dark:text-white"
            >
              <ChevronLeft size={18}/>
            </button>
            <button 
              disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}
              className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-50 dark:text-white"
            >
              <ChevronRight size={18}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonyManagement;