import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import FloatingButton from './FloatingButton';
import { Globe, ChevronRight, Phone, MessageCircle } from 'lucide-react';

const Citizenship = () => {
    const navigate = useNavigate();

    // Full country list
    const programs = [
        { id: "antigua", name: "Antigua and Barbuda", cost: "USD 230,000", desc: "One of the most competitive citizenship programs in the Caribbean." },
        { id: "argentina", name: "Argentina", cost: "In Development", desc: "Currently under development and will launch in the second half of 2026." },
        { id: "austria", name: "Austria", cost: "Economic Contribution", desc: "Prospective citizens can demonstrate extraordinary achievements that benefit Austria." },
        { id: "dominica", name: "Dominica", cost: "USD 200,000", desc: "Offers an attractive citizenship program with a real estate investment option." },
        { id: "egypt", name: "Egypt", cost: "USD 250,000", desc: "Benefit from the country's transcontinental position between Africa and Asia." },
        { id: "grenada", name: "Grenada", cost: "E-2 Investor Visa", desc: "Holds an E-2 treaty with the USA, allowing citizens to apply for a non-immigrant visa." },
        { id: "jordan", name: "Jordan", cost: "JOD 350,000", desc: "Grants investors access to a business-friendly location and peaceful Arab country." },
        { id: "malta", name: "Malta", cost: "Exceptional Service", desc: "Provides a legal framework for citizenship by merit for exceptional service." },
        { id: "montenegro", name: "Montenegro", cost: "Concluded", desc: "Program was concluded on 31 December 2022. Contact us for alternatives." },
        { id: "nauru", name: "Nauru", cost: "Economic Development", desc: "Offers a secure second citizenship and an opportunity to support climate resilience." },
        { id: "macedonia", name: "North Macedonia", cost: "EUR 200,000", desc: "Offers foreign nationals the opportunity to acquire citizenship in SE Europe." },
        { id: "sao-tome", name: "São Tomé and Príncipe", cost: "USD 90,000", desc: "Grants citizenship to investors and their families for a donation to the National Fund." },
        { id: "st-kitts", name: "St. Kitts and Nevis", cost: "USD 250,000", desc: "Has one of the strongest passports among all the Caribbean citizenship programs." },
        { id: "st-lucia", name: "St. Lucia", cost: "USD 240,000", desc: "Offers a real estate development option and visa-free access to over 140 destinations." },
        { id: "turkiye", name: "Türkiye", cost: "Real Estate", desc: "Provides links to both Asia and Europe with access to markets in both regions." },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
            <FloatingButton />
            {/* --- Hero Section --- */}
            <section className="pt-44 pb-20 px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
                <div className="flex-1">
                    <span className="text-red-600 font-black uppercase tracking-[0.4em] text-[10px] mb-6 block">Citizenship</span>
                    <h1 className="text-5xl lg:text-7xl font-serif text-navy-900 dark:text-white leading-tight mb-8">
                        Leading <span className="text-slate-400">Citizenship</span> by Investment Programs
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-10 max-w-xl">
                        Acquiring alternative citizenship gives you the right to travel freely and settle in another country with security.
                    </p>
                    <button className="border-2 border-navy-900 dark:border-white px-10 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-navy-900 hover:text-white dark:hover:bg-white dark:hover:text-navy-900 transition-all">
                        Private Client Enquiry
                    </button>
                </div>
                <div className="flex-1 w-full h-[500px] bg-slate-100 rounded-sm overflow-hidden shadow-2xl">
                    <img src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=1200" alt="Global Access" className="w-full h-full object-cover grayscale-[20%]" />
                </div>
            </section>

            {/* --- Countries Grid --- */}
            <section className="py-32 px-8 max-w-7xl mx-auto">
                <h2 className="text-4xl font-serif text-navy-900 dark:text-white mb-20 border-b pb-6 border-slate-100">Citizenship by Investment Options</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
                    {programs.map((p, i) => (
                        <div 
                            key={i} 
                            onClick={() => navigate(`/citizenship/${p.id}`)}
                            className="group cursor-pointer border-b border-slate-100 pb-12 hover:border-red-600 transition-all flex flex-col justify-between h-full"
                        >
                            <div>
                                <div className="mb-6 flex items-center justify-between">
                                    <Globe className="text-red-600" size={32} />
                                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-red-600 transition-colors">
                                        View Program <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-serif text-navy-900 dark:text-white mb-4 group-hover:text-red-600 transition-colors">{p.name}</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 h-12 overflow-hidden">{p.desc}</p>
                            </div>

                            <div className="space-y-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-navy-900 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded">
                                    {p.cost}
                                </span>
                                {/* ✅ READ MORE ADDED EXPLICITLY */}
                                <div className="pt-4 flex items-center gap-1 text-[11px] font-bold text-red-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                    Read More <ChevronRight size={14} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- CONTACT CTA --- */}
            <section className="py-24 bg-slate-50 dark:bg-slate-900 px-8 relative overflow-hidden">
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <span className="text-red-600 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Personalized Assistance</span>
                    <h2 className="text-4xl lg:text-5xl font-serif text-navy-900 dark:text-white mb-6">Connect With Our Specialists</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto font-light text-lg">
                        Speak with our global experts via your preferred channel to start your journey.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        {/* Direct Call Button */}
                        <a 
                            href="tel:+8801XXXXXXXXX" // Tomar Phone Number eikhane boshao
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-navy-900 dark:bg-white dark:text-navy-900 text-white px-10 py-5 text-[10px] font-black uppercase tracking-widest hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white transition-all shadow-xl"
                        >
                            <Phone size={16} /> Direct Call
                        </a>

                        {/* WhatsApp Button */}
                        <a 
                            href="https://wa.me/8801XXXXXXXXX?text=I'm%20interested%20in%20citizenship%20investment" // Number-er agey country code (88) thakte hobe
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#25D366] text-white px-10 py-5 text-[10px] font-black uppercase tracking-widest hover:bg-[#128C7E] transition-all shadow-xl"
                        >
                            <MessageCircle size={16} /> WhatsApp Us
                        </a>
                    </div>

                    {/* Display Number for Trust */}
                    <p className="mt-10 text-slate-400 text-sm font-light">
                        Available 24/7 for premium consultations: <span className="text-navy-900 dark:text-white font-medium">+880 1XXX XXXXXX</span>
                    </p>
                </div>
            </section>
        </div>
    );
};

export default Citizenship;