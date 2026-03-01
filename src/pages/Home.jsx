import React from 'react';
import { motion } from 'framer-motion';
import Hero from '../pages/User-Side/Hero';
import TopSuggestions from '../pages/User-Side/TopSuggestions';
import WorkFlow from '../pages/User-Side/WorkFlow';
import BinanceSticker from '../pages/User-Side/BinanceSticker';
import About from '../pages/User-Side/AboutSection';
import Feature from '../pages/User-Side/Features';
import FloatingButton from '../pages/User-Side/FloatingButton';
import Service from '../pages/User-Side/Services';
import ServiceArea from '../pages/User-Side/ServiceArea';
import FAQ from '../pages/User-Side/FAQ';
import Testimony from '../pages/User-Side/Testimonials';
import Blog from '../pages/User-Side/Blog';


const Home = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-slate-900 dark:text-white transition-colors duration-500"> 

      <Hero />
      <TopSuggestions />
      <WorkFlow />
      <FloatingButton />
      <BinanceSticker />
      <ServiceArea />
      <Feature />
      <FAQ />
      <Blog />
      <About />
      <Testimony />

    </div>
  )
}
export default Home;