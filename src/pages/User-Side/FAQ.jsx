import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  { q: "How long does a Poland Work Permit take?", a: "Typically it takes 3 to 5 months depending on the employer's response and embassy schedule." },
  { q: "Do you accept Crypto payments for Tour packages?", a: "Yes! We are Binance-ready. You can pay using USDT or BTC for all international tours." },
  { q: "Is the Visa fee refundable if rejected?", a: "Visa fees are usually embassy-controlled and non-refundable, but our consultancy fee has a partial refund policy." }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="py-24 bg-slate-50 dark:bg-[#0a0a0a]">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter">Questions? <span className="text-blue-600">Answers.</span></h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-3xl border border-slate-200 dark:border-white/5 bg-white dark:bg-zinc-900/40 overflow-hidden">
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full p-6 flex justify-between items-center text-left"
              >
                <span className="font-bold text-slate-900 dark:text-white uppercase italic text-sm tracking-tight">{faq.q}</span>
                {openIndex === i ? <Minus className="text-blue-600" /> : <Plus className="text-blue-600" />}
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div 
                    initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 text-slate-500 dark:text-zinc-400 text-sm leading-relaxed border-t border-slate-100 dark:border-white/5">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;