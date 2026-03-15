import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { citizenshipData } from '../../constants/citizenshipData';
import FloatingButton from './FloatingButton';
import { 
    CheckCircle2, ArrowLeft, Clock, Shield, Landmark, 
    Globe2, Award, TrendingUp, HelpCircle, ChevronDown, Plus, Minus, ShieldCheck 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CitizenshipDetail = () => {
    const { countryId } = useParams();
    const navigate = useNavigate();
    const data = citizenshipData[countryId];
    const [activeFaq, setActiveFaq] = useState(null);

    useEffect(() => { window.scrollTo(0, 0); }, [countryId]);

    if (!data) return (
        <div className="h-screen flex items-center justify-center bg-slate-950">
            <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-t-2 border-red-600 rounded-full"
            />
        </div>
    );

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300 selection:bg-red-100">
            
            <FloatingButton />

            {/* --- HERO SECTION WITH PARALLAX EFFECT --- */}
            <section className="relative min-h-screen flex items-center pt-30 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src={data.heroImage} className="w-full h-full object-cover opacity-20 dark:opacity-30 scale-105" alt="Background" />
                    <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white dark:from-slate-950 dark:via-transparent dark:to-slate-950"></div>
                </div>

                <div className="max-w-7xl mx-auto px-8 relative z-10 grid lg:grid-cols-12 gap-16 items-center">
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-7 space-y-8"
                    >
                        <button onClick={() => navigate('/citizenship')} className="group flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-red-600/60 hover:text-red-600 transition-all">
                            <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Global Portfolio
                        </button>
                        
                        <div className="space-y-4">
                            <motion.div initial={{ width: 0 }} animate={{ width: "80px" }} className="h-1 bg-red-600"></motion.div>
                            <h1 className="text-7xl lg:text-9xl font-serif text-navy-900 dark:text-white leading-[0.9] tracking-tighter">
                                {data.name} <br />
                                <span className="text-red-600 italic">Legacy.</span>
                            </h1>
                        </div>

                        <p className="text-2xl text-slate-600 dark:text-slate-400 font-light leading-relaxed max-w-xl border-l-4 border-slate-100 dark:border-slate-800 pl-8">
                            {data.tagline || data.overview.substring(0, 100) + "..."}
                        </p>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="lg:col-span-5 relative"
                    >
                        <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border-[12px] border-white dark:border-slate-900 relative group">
                            <img src={data.heroImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" alt={data.name} />
                            <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 to-transparent"></div>
                            <div className="absolute bottom-8 left-8">
                                <span className="text-[10px] text-white/70 uppercase tracking-[0.3em] font-bold">Investment starting from</span>
                                <h3 className="text-4xl text-white font-serif">{data.investmentSummary.minCapital}</h3>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* --- FLOATING STATS GRID --- */}
            <section className="py-20 px-8 relative -mt-24 z-20">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-px bg-slate-200 dark:bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
                    {[
                        { label: 'Visa-Free Access', value: data.investmentSummary.visaFree, icon: Globe2 },
                        { label: 'Process Time', value: data.investmentSummary.timeframe, icon: Clock },
                        { label: 'Capital Required', value: data.investmentSummary.minCapital, icon: Landmark },
                        { label: 'Global Tier', value: data.tier, icon: Award },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white dark:bg-slate-900 p-10 flex flex-col items-center text-center group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <stat.icon className="text-red-600 mb-6 group-hover:scale-110 transition-transform" size={32} strokeWidth={1.5} />
                            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 mb-2">{stat.label}</span>
                            <span className="text-xl font-serif text-navy-900 dark:text-white">{stat.value}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- PREMIUM CONTENT: BENEFITS & REQS --- */}
            <section className="py-32 px-8">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24">
                    <div className="space-y-12">
                        <div>
                            <span className="text-red-600 font-black text-[10px] uppercase tracking-[0.4em]">Strategic Advantages</span>
                            <h2 className="text-5xl font-serif text-navy-900 dark:text-white mt-4 italic">The Privileges of Rank</h2>
                        </div>
                        <div className="space-y-4">
                            {data.benefits.map((benefit, i) => (
                                <motion.div 
                                    whileHover={{ x: 10 }}
                                    key={i} 
                                    className="p-6 rounded-xl border border-slate-100 dark:border-slate-800 flex gap-6 items-start hover:shadow-xl transition-all dark:bg-slate-900/40"
                                >
                                    <div className="w-10 h-10 rounded-full bg-red-600/10 flex items-center justify-center shrink-0">
                                        <Shield size={18} className="text-red-600" />
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-400 font-light leading-relaxed">{benefit}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-12 space-y-12 border border-slate-100 dark:border-slate-800">
                        <div>
                            <span className="text-red-600 font-black text-[10px] uppercase tracking-[0.4em]">Mandatory Compliance</span>
                            <h2 className="text-5xl font-serif text-navy-900 dark:text-white mt-4">Statutory Criteria</h2>
                        </div>
                        <ul className="space-y-8">
                            {data.requirements.map((req, i) => (
                                <li key={i} className="flex gap-6 group">
                                    <div className="h-6 w-6 rounded-full border border-red-600 flex items-center justify-center mt-1 group-hover:bg-red-600 transition-colors">
                                        <div className="h-1 w-1 bg-red-600 group-hover:bg-white rounded-full"></div>
                                    </div>
                                    <span className="text-lg text-slate-700 dark:text-slate-300 font-light">{req}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* --- UPDATED ROADMAP --- */}
            <section className="py-32 px-8 bg-white dark:bg-slate-950">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
                        <div className="max-w-2xl">
                            <span className="text-red-600 font-black text-[10px] uppercase tracking-[0.4em]">The Protocol</span>
                            <h2 className="text-6xl font-serif text-navy-900 dark:text-white mt-4 leading-tight">Procedural Execution Roadmap</h2>
                        </div>
                        <p className="text-slate-400 italic max-w-xs text-right">Average completion timeline: <br/><span className="text-navy-900 dark:text-white font-serif text-xl">{data.investmentSummary.timeframe}</span></p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
                        {data.process.map((step, i) => (
                            <div key={i} className="relative group">
                                <div className="text-8xl font-serif text-slate-100 dark:text-slate-900 absolute -top-12 -left-4 z-0 group-hover:text-red-600/10 transition-colors">
                                    {step.step}
                                </div>
                                <div className="relative z-10 pt-8">
                                    <h4 className="text-xl font-serif text-navy-900 dark:text-white mb-4 border-b border-red-600/20 pb-4">{step.title}</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-light">{step.detail}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- PREMIUM FAQ SECTION --- */}
            <section className="py-32 px-8 bg-slate-950 text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600 blur-[150px] rounded-full"></div>
                </div>
                
                <div className="max-w-4xl mx-auto relative z-10">
                    <div className="text-center mb-20">
                        <HelpCircle className="mx-auto text-red-600 mb-6" size={48} strokeWidth={1} />
                        <h2 className="text-5xl font-serif mb-4">Frequently Asked <span className="text-red-600 italic">Inquiries</span></h2>
                        <p className="text-slate-500 uppercase tracking-widest text-[10px] font-bold">Expert Intelligence & Clarification</p>
                    </div>

                    <div className="space-y-4">
                        {data.faqs && data.faqs.map((faq, i) => (
                            <div key={i} className="border-b border-white/10">
                                <button 
                                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                                    className="w-full py-8 flex items-center justify-between text-left group"
                                >
                                    <span className="text-xl font-serif group-hover:text-red-500 transition-colors">{faq.question}</span>
                                    {activeFaq === i ? <Minus className="text-red-600" /> : <Plus className="text-slate-600" />}
                                </button>
                                <AnimatePresence>
                                    {activeFaq === i && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <p className="pb-8 text-slate-400 font-light leading-relaxed text-lg">
                                                {faq.answer}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* --- FINAL MASTER CTA --- */}
            <section className="py-40 px-8 relative overflow-hidden bg-slate-50 dark:bg-slate-900/20">
                <div className="max-w-5xl mx-auto text-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="space-y-12"
                    >
                        <h2 className="text-6xl lg:text-8xl font-serif text-navy-900 dark:text-white leading-none">
                            Ready to <span className="italic text-red-600">Secure</span> <br/> Your Global Future?
                        </h2>
                        <p className="text-xl text-slate-500 font-light max-w-2xl mx-auto">
                            Our private wealth partners are ready to facilitate your journey towards {data.name} citizenship.
                        </p>
                        
                        <div className="space-y-8 flex flex-col items-center justify-center">
                            <a 
                                href="tel:+8801XXXXXXXXX" // Eikhane main number ta boshiye dio
                                className="inline-block bg-red-600 text-white px-16 py-6 text-[11px] font-black uppercase tracking-[0.3em] hover:bg-navy-900 dark:hover:bg-white dark:hover:text-navy-900 transition-all shadow-[0_20px_40px_-10px_rgba(220,38,38,0.3)] group"
                            >
                                Request For a Call
                            </a>

                            <div className="flex flex-col items-center gap-2">
                                <span className="text-[10px] text-slate-400 uppercase tracking-[0.3em] font-bold">Direct Line</span>
                                <a 
                                    href="tel:+8801XXXXXXXXX" 
                                    className="text-2xl font-serif text-navy-900 dark:text-white hover:text-red-600 transition-colors"
                                >
                                    +880 1XXX XXXXXX
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* --- WHY CHOOSE GAME ROUTES (THE TRUST FACTOR) --- */}
            <section className="py-32 px-8 bg-slate-50 dark:bg-slate-900/10">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-8">
                            <div>
                                <span className="text-red-600 font-black text-[10px] uppercase tracking-[0.4em]">The Strategic Edge</span>
                                <h2 className="text-5xl font-serif text-navy-900 dark:text-white mt-4 leading-tight">
                                    Why Discerning Investors <br/> Choose <span className="italic text-red-600">Game Routes</span>
                                </h2>
                            </div>
                            
                            <p className="text-lg text-slate-600 dark:text-slate-400 font-light leading-relaxed">
                                Navigating global naturalization requires more than just capital—it requires a partner with absolute discretion, legal precision, and an elite network of global government liaisons.
                            </p>

                            <div className="grid sm:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <div className="h-12 w-12 bg-white dark:bg-slate-800 rounded-xl shadow-sm flex items-center justify-center">
                                        <ShieldCheck className="text-red-600" size={24} />
                                    </div>
                                    <h4 className="font-serif text-xl dark:text-white">Absolute Privacy</h4>
                                    <p className="text-sm text-slate-500">Your data is secured through military-grade encryption and strict Swiss-standard confidentiality.</p>
                                </div>
                                <div className="space-y-3">
                                    <div className="h-12 w-12 bg-white dark:bg-slate-800 rounded-xl shadow-sm flex items-center justify-center">
                                        <Landmark className="text-red-600" size={24} />
                                    </div>
                                    <h4 className="font-serif text-xl dark:text-white">Direct Liaison</h4>
                                    <p className="text-sm text-slate-500">We work directly with government-authorized agents, bypassing unnecessary third-party overheads.</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -inset-10 bg-red-600/5 rounded-full blur-3xl"></div>
                            <div className="relative grid grid-cols-2 gap-4">
                                <div className="space-y-4 pt-12">
                                    <div className="bg-navy-900 p-8 rounded-2xl text-white space-y-2">
                                        <p className="text-4xl font-serif">100%</p>
                                        <p className="text-[10px] uppercase tracking-widest opacity-60 font-bold">Success Rate</p>
                                    </div>
                                    <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-2">
                                        <p className="text-4xl font-serif text-red-600">500+</p>
                                        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Global Families</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-2">
                                        <p className="text-4xl font-serif text-red-600">12+</p>
                                        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Years Experience</p>
                                    </div>
                                    <div className="bg-red-600 p-8 rounded-2xl text-white space-y-2 shadow-2xl shadow-red-600/20">
                                        <p className="text-4xl font-serif">24h</p>
                                        <p className="text-[10px] uppercase tracking-widest opacity-80 font-bold">Private Concierge</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CitizenshipDetail;