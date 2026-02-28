import React from 'react';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md cursor-pointer hover:bg-white/10 transition-all group">
      <Globe size={16} className="text-blue-400 group-hover:rotate-180 transition-transform duration-500" />
      <select className="bg-transparent text-white text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer">
        <option className="bg-slate-900">EN (Global)</option>
        <option className="bg-slate-900">BN (Bangladesh)</option>
        <option className="bg-slate-900">PL (Poland)</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;