import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { TrendingUp, Users, DollarSign, Briefcase, FileText, Download, Loader2, Globe, CheckCircle } from 'lucide-react';

const AnalyticsDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Backend api-te token pathate hobe jodi middleware thake
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (err) {
      console.error("Analytics Sync Failed", err);
    } finally {
      setLoading(false);
    }
  };

  // --- PDF Export Logic ---
  const exportPDF = () => {
    if (!stats || !stats.recentBookings || stats.recentBookings.length === 0) {
        alert("System Alert: No transaction logs found to export.");
        return;
    }

    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(30, 41, 59);
    doc.text("GAME ROUTES AGENCY - EXECUTIVE REPORT", 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Timestamp: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`Visa Success Rate: ${stats.visaSuccess || 0}%`, 14, 35);
    doc.text(`Operational Revenue: $${(stats.revenue || 0).toLocaleString()}`, 14, 40);

    const tableColumn = ["Client Name", "Package", "Amount", "Status"];
    const tableRows = stats.recentBookings.map(item => [
      item.client_name,
      item.package,
      `$${item.price}`,
      item.status ? item.status.toUpperCase() : 'PENDING'
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 50,
      theme: 'grid',
      headStyles: { fillColor: [185, 28, 28], fontStyle: 'bold' },
      styles: { fontSize: 8, fontStyle: 'italic' }
    });

    doc.save(`GR_Executive_Report_${Date.now()}.pdf`);
  };

  // --- Loading State ---
  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-red-600" size={40} />
      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Synchronizing Data</span>
    </div>
  );

  // --- Empty State Check ---
  if (!stats) return (
    <div className="h-[60vh] flex items-center justify-center text-slate-500 font-bold">
        Error loading analytics. Please check backend connection.
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Gross Revenue" value={`$${(stats.revenue || 0).toLocaleString()}`} icon={<DollarSign/>} color="bg-emerald-600" />
        <StatCard title="Total Bookings" value={stats.bookings || 0} icon={<Briefcase/>} color="bg-red-700" />
        <StatCard title="Visa Success" value={`${stats.visaSuccess || '0'}%`} icon={<Globe/>} color="bg-blue-700" />
        <StatCard title="Staff Members" value={stats.staff || 0} icon={<Users/>} color="bg-slate-800" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Operational Growth Chart */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[45px] shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-2 text-slate-900">
              <TrendingUp className="text-red-600" /> Growth Trajectory
            </h3>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              {/* Fallback to empty array if growth is null */}
              <AreaChart data={stats.growth || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: '800', fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: '800', fill: '#94a3b8'}} />
                <Tooltip 
                    contentStyle={{borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                    cursor={{stroke: '#EF4444', strokeWidth: 2}}
                />
                <Area type="monotone" dataKey="bookings" stroke="#B91C1C" strokeWidth={4} fillOpacity={0.1} fill="#EF4444" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Intelligence Hub */}
        <div className="bg-slate-900 p-10 rounded-[45px] shadow-2xl text-white flex flex-col justify-between overflow-hidden relative">
          <CheckCircle className="absolute -bottom-10 -right-10 text-white opacity-5" size={200} />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-red-500 mb-4">
               <FileText size={20} />
               <span className="text-[10px] font-black uppercase tracking-widest">Platform Intelligence</span>
            </div>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-tight mb-6">
              Executive <br /> <span className="text-red-600 underline">Summary</span>
            </h2>
            <p className="text-slate-400 text-sm font-medium leading-relaxed italic">
              Platform analysis indicates a total of {stats.bookings || 0} processed transaction logs. 
              The current Visa success rate is stable at {stats.visaSuccess || 0}%. 
            </p>
          </div>

          <div className="space-y-4 relative z-10">
            <button 
              onClick={exportPDF}
              className="group w-full bg-white text-black p-5 rounded-2xl font-black uppercase italic text-xs tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-3 shadow-xl"
            >
              <Download className="group-hover:bounce" size={18}/> Export Report (PDF)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 hover:border-red-600 transition-colors duration-300">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg ${color}`}>
        {React.cloneElement(icon, { size: 24 })}
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">{title}</p>
    <h4 className="text-3xl font-black italic text-slate-900 tracking-tighter">{value}</h4>
  </div>
);

export default AnalyticsDashboard;