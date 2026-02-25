import React from 'react';

const RecruiterDashboard = () => {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-6">Recruiter Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <p className="text-slate-500 text-sm font-bold uppercase">Active Jobs</p>
                    <h3 className="text-4xl font-black text-indigo-600 mt-2">0</h3>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <p className="text-slate-500 text-sm font-bold uppercase">Total Applications</p>
                    <h3 className="text-4xl font-black text-emerald-500 mt-2">0</h3>
                </div>
            </div>
        </div>
    );
};

export default RecruiterDashboard; // Eita must thakte hobe