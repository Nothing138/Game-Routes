import React from 'react';
import { Briefcase, Users, CheckCircle, Clock } from 'lucide-react';

const RecruiterDashboard = () => {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard icon={<Briefcase className="text-red-600"/>} label="Total Jobs" value="12" />
                <StatCard icon={<Users className="text-blue-600"/>} label="Applicants" value="148" />
                <StatCard icon={<CheckCircle className="text-emerald-600"/>} label="Shortlisted" value="24" />
                <StatCard icon={<Clock className="text-amber-600"/>} label="Pending Reviews" value="09" />
            </div>

            <div className="bg-white p-10 rounded-[50px] shadow-sm border border-gray-100">
                <h3 className="text-2xl font-black italic uppercase text-slate-900 border-l-8 border-red-600 pl-4 mb-6">
                    Recent <span className="text-red-600">Activity</span>
                </h3>
                <p className="text-slate-400 italic">No recent job applications to show.</p>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value }) => (
    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 hover:scale-105 transition-transform cursor-pointer">
        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
            {icon}
        </div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">{label}</p>
        <h4 className="text-3xl font-black italic text-slate-900 tracking-tighter mt-1">{value}</h4>
    </div>
);

export default RecruiterDashboard;