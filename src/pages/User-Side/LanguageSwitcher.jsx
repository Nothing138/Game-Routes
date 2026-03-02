import React, { useEffect, useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'zh-CN', name: '中文', flag: '🇨🇳' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ms', name: 'Melayu', flag: '🇲🇾' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰' },
  { code: 'ne', name: 'नेपाली', flag: '🇳🇵' },
  { code: 'af', name: 'Afrikaans', flag: '🇿🇦' }
];

const GlobalLanguageSwitcher = () => {
  const [selectedLang, setSelectedLang] = useState('English');

  const changeLanguage = (langCode, langName) => {
    const selectEl = document.querySelector('.goog-te-combo');
    if (selectEl) {
      selectEl.value = langCode;
      selectEl.dispatchEvent(new Event('change'));
      setSelectedLang(langName);
    }
  };

  return (
    <div className="relative group">
      {/* Hidden Default Google Widget (Don't Remove) */}
      <div id="google_translate_element" style={{ display: 'none' }}></div>

      <button className="flex items-center gap-2 px-4 py-2 bg-slate-900/10 dark:bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/20 rounded-full transition-all duration-300">
        <Globe size={16} className="text-blue-500" />
        <span className="text-xs font-black uppercase text-slate-700 dark:text-white">{selectedLang}</span>
        <ChevronDown size={14} className="text-slate-400" />
      </button>

      {/* Grid Style Dropdown for many languages */}
      <div className="absolute right-0 mt-3 w-64 p-3 origin-top-right rounded-[2rem] bg-white dark:bg-zinc-900 shadow-2xl border border-slate-100 dark:border-slate-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[9999] grid grid-cols-2 gap-2">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code, lang.name)}
            className="flex items-center gap-2 px-3 py-2 text-[10px] font-bold text-slate-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 rounded-xl transition-all"
          >
            <span>{lang.flag}</span>
            <span>{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GlobalLanguageSwitcher;