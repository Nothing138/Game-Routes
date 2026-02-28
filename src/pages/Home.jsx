import React from 'react';
import { motion } from 'framer-motion';
import Hero from '../pages/User-Side/Hero';
import TopSuggestions from '../pages/User-Side/TopSuggestions';
import WorkFlow from '../pages/User-Side/WorkFlow';
import BinanceSticker from '../pages/User-Side/BinanceSticker';
import About from '../pages/User-Side/AboutSection';

const Home = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-slate-900 dark:text-white transition-colors duration-500"> 

      <Hero />
      <TopSuggestions />
      <WorkFlow />
      <BinanceSticker />
      <About />

    </div>
  )
}
export default Home;