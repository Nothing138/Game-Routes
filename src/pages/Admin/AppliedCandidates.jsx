import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Search, Filter, Trash2, CheckCircle, XCircle, FileText, Mail, ArrowUpDown, ChevronLeft, ChevronRight, UserCheck } from 'lucide-react';

const AppliedCandidates = () => {
    const [applicants, setApplicants] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Pagination & Sorting States
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);
    const [sortOrder, setSortOrder] = useState('desc');
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/api/admin/applied-candidates');
            setApplicants(res.data);
            setFilteredData(res.data);
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    // Filter & Search Logic
    useEffect(() => {
        let result = applicants.filter(app => {
            const matchesSearch = app.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 app.job_title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = filterStatus === 'All' || app.status === filterStatus;
            return matchesSearch && matchesStatus;
        });

        // Sorting
        result.sort((a, b) => {
            return sortOrder === 'desc' ? b.id - a.id : a.id - b.id;
        });

        setFilteredData(result);
        setCurrentPage(1);
    }, [searchQuery, filterStatus, sortOrder, applicants]);

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    // Status Update Handler
    const updateStatus = async (id, newStatus) => {
        try {
            await axios.patch(`http://localhost:5000/api/admin/applications/${id}/status`, { status: newStatus });
            const Toast = Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
            Toast.fire({ icon: 'success', title: `Status: ${newStatus.toUpperCase()}` });
            fetchData();
        } catch (err) { Swal.fire('Error', 'Update failed', 'error'); }
    };

    // Delete Handler
    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Eject Applicant?',
            text: "This will permanently remove the application.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#000',
            confirmButtonText: 'Confirm Delete',
            customClass: { popup: 'rounded-[40px]' }
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.delete(`http://localhost:5000/api/admin/applications/${id}`);
                fetchData();
            }
        });
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'hired': return 'bg-green-100 text-green-600 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-600 border-red-200';
            case 'shortlisted': return 'bg-blue-100 text-blue-600 border-blue-200';
            default: return 'bg-gray-100 text-gray-500 border-gray-200';
        }
    };

    return (
        <div className="space-y-8 pb-20">
            {/* --- TOP BOMB CONTROLS --- */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter">CANDIDATE <span className="text-red-600">LIST</span></h2>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Total {filteredData.length} Applications Found</p>
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                    {/* Search */}
                    <div className="relative flex-grow lg:flex-grow-0">
                        <Search className="absolute left-4 top-3.5 text-gray-400" size={16}/>
                        <input 
                            placeholder="Search Name or Job..." 
                            className="w-full lg:w-64 pl-12 pr-4 py-3 bg-white border-2 border-black rounded-2xl font-bold text-xs outline-none focus:bg-slate-50 transition-all"
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Filter Dropdown */}
                    <div className="relative">
                        <Filter className="absolute left-4 top-3.5 text-gray-400" size={16}/>
                        <select 
                            className="pl-12 pr-8 py-3 bg-white border-2 border-black rounded-2xl font-bold text-xs appearance-none outline-none cursor-pointer"
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="All">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="hired">Hired</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>

                    {/* Sort Button */}
                    <button 
                        onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                        className="p-3 bg-black text-white rounded-2xl hover:bg-red-600 transition-all"
                    >
                        <ArrowUpDown size={18}/>
                    </button>
                </div>
            </div>

            {/* --- APPLICANTS TABLE/GRID --- */}
            <div className="grid grid-cols-1 gap-4">
                {currentItems.map(app => (
                    <div key={app.id} className="group relative">
                        <div className="absolute inset-0 bg-black rounded-[30px] translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 transition-all"></div>
                        <div className="relative bg-white border-2 border-black rounded-[30px] p-6 flex flex-col lg:flex-row items-center justify-between gap-6 overflow-hidden">
                            
                            {/* Candidate Info */}
                            <div className="flex items-center gap-5 w-full lg:w-1/3">
                                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-xl font-black italic border-2 border-slate-50 group-hover:bg-red-50 group-hover:text-red-600 transition-colors">
                                    {app.full_name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-black uppercase italic text-sm tracking-tight">{app.full_name}</h4>
                                    <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1 uppercase tracking-tighter">
                                        <Mail size={10}/> {app.email}
                                    </p>
                                </div>
                            </div>

                            {/* Job Info */}
                            <div className="w-full lg:w-1/4">
                                <span className="text-[8px] font-black text-red-500 uppercase tracking-widest block mb-1">Applying For</span>
                                <h5 className="font-bold text-xs uppercase">{app.job_title}</h5>
                                <span className="text-[9px] text-gray-400 font-medium">Applied: {new Date(app.created_at).toDateString()}</span>
                            </div>

                            {/* Status Badge */}
                            <div className="w-full lg:w-auto text-center">
                                <span className={`px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border-2 ${getStatusColor(app.status)}`}>
                                    {app.status}
                                </span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
                                <a href={app.resume_url} target="_blank" rel="noreferrer" className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-black hover:text-white transition-all shadow-sm">
                                    <FileText size={16}/>
                                </a>
                                
                                <div className="h-8 w-[1px] bg-gray-100 hidden lg:block mx-2"></div>

                                {/* Status Controls */}
                                <button onClick={() => updateStatus(app.id, 'shortlisted')} className="p-3 bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all shadow-sm">
                                    <UserCheck size={16}/>
                                </button>
                                <button onClick={() => updateStatus(app.id, 'hired')} className="p-3 bg-green-50 text-green-500 rounded-xl hover:bg-green-500 hover:text-white transition-all shadow-sm">
                                    <CheckCircle size={16}/>
                                </button>
                                <button onClick={() => updateStatus(app.id, 'rejected')} className="p-3 bg-orange-50 text-orange-400 rounded-xl hover:bg-orange-500 hover:text-white transition-all shadow-sm">
                                    <XCircle size={16}/>
                                </button>
                                <button onClick={() => handleDelete(app.id)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm">
                                    <Trash2 size={16}/>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- PAGINATION CONTROLS --- */}
            <div className="flex justify-between items-center bg-white p-6 rounded-[35px] border-2 border-black">
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                    Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length}
                </p>
                <div className="flex gap-3">
                    <button 
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        className={`p-3 rounded-xl border-2 border-black transition-all ${currentPage === 1 ? 'opacity-20' : 'hover:bg-black hover:text-white'}`}
                    >
                        <ChevronLeft size={18}/>
                    </button>
                    <button 
                        disabled={indexOfLastItem >= filteredData.length}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        className={`p-3 rounded-xl border-2 border-black transition-all ${indexOfLastItem >= filteredData.length ? 'opacity-20' : 'hover:bg-black hover:text-white'}`}
                    >
                        <ChevronRight size={18}/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AppliedCandidates;