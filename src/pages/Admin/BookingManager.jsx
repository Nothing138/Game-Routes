import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { CheckCircle, X, Clock, Mail, Phone, Calendar } from 'lucide-react';

const BookingManager = () => {
    const [bookings, setBookings] = useState([]);

    const fetchBookings = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/tours/bookings');
            setBookings(res.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchBookings(); }, []);

    const handleStatus = async (id, status) => {
        try {
            await axios.put(`http://localhost:5000/api/tours/update-booking/${id}`, { status });
            Swal.fire({ title: `Booking ${status}`, icon: 'success', timer: 1000, showConfirmButton: false });
            fetchBookings();
        } catch (err) { Swal.fire('Error', 'Update failed', 'error'); }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Header */}
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black italic uppercase text-slate-900 tracking-tighter">Booking <span className="text-red-600">Vault</span></h2>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[3px] mt-1 italic">Process and confirm travel requests</p>
                </div>
                <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black italic text-xs uppercase tracking-widest">
                    Total: {bookings.length}
                </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-white rounded-[50px] shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-900 text-white uppercase text-[11px] font-black italic tracking-widest">
                        <tr>
                            <th className="p-8">Customer Details</th>
                            <th className="p-8">Selected Package</th>
                            <th className="p-8">Booking Date</th>
                            <th className="p-8 text-center">Status</th>
                            <th className="p-8 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {bookings.map((book) => (
                            <tr key={book.id} className="hover:bg-slate-50 transition-all group">
                                <td className="p-8">
                                    <div>
                                        <p className="font-black text-slate-900 italic text-base uppercase">{book.client_name}</p>
                                        <div className="flex flex-col gap-1 mt-1 text-gray-400 font-bold text-[10px] uppercase">
                                            <span className="flex items-center gap-1"><Mail size={12}/> {book.client_email}</span>
                                            <span className="flex items-center gap-1"><Phone size={12}/> {book.phone}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-8">
                                    <span className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase italic tracking-wider">
                                        {book.package_name}
                                    </span>
                                </td>
                                <td className="p-8">
                                    <div className="text-[11px] font-bold text-gray-500 flex items-center gap-2">
                                        <Calendar size={14}/> {new Date(book.booking_date).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="p-8 text-center">
                                    <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase italic tracking-tighter
                                        ${book.status === 'confirmed' ? 'bg-emerald-100 text-emerald-600' : 
                                          book.status === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                                        {book.status}
                                    </span>
                                </td>
                                <td className="p-8">
                                    <div className="flex justify-center gap-3">
                                        <button 
                                            onClick={() => handleStatus(book.id, 'confirmed')}
                                            className="w-10 h-10 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl flex items-center justify-center transition-all shadow-sm"
                                        >
                                            <CheckCircle size={18}/>
                                        </button>
                                        <button 
                                            onClick={() => handleStatus(book.id, 'cancelled')}
                                            className="w-10 h-10 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl flex items-center justify-center transition-all shadow-sm"
                                        >
                                            <X size={18}/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BookingManager;