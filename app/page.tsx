'use client';

import Link from 'next/link';
import { 
  ArrowRight, 
  BarChart3, 
  Briefcase, 
  DollarSign, 
  Zap, 
  ChevronRight, 
  Sparkles, 
  Shield, 
  Globe, 
  MousePointer2,
  CheckCircle2,
  Lock,
  LayoutDashboard
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';

function FeatureCard({ feature, i }: { feature: any, i: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Scale the image up slightly as we scroll past it to create depth
  const imageScale = useTransform(smoothProgress, [0, 0.5, 1], [0.9, 1, 1.15]);

  return (
    <div 
      ref={cardRef}
      id={i === 2 ? 'intelligence' : undefined}
      className="sticky top-0 w-full h-screen flex items-center justify-center px-6"
    >
      <motion.div 
        className="w-full max-w-6xl aspect-auto lg:aspect-[2/1] bg-[#0A0A0B] rounded-[40px] border border-white/5 shadow-[0_-20px_60px_rgba(0,0,0,0.6)] flex flex-col lg:flex-row overflow-hidden absolute"
        style={{
          top: `calc(10vh + ${i * 40}px)`, 
          height: '80vh'
        }}
        initial={{ opacity: 0, y: 150 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Left Content bg-[#0A0A0B] ensures it overlays perfectly when stacked */}
        <div className="w-full lg:w-1/2 p-10 lg:p-20 flex flex-col justify-center relative z-20 bg-[#0A0A0B]">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4CE3BC]/20 to-[#25AAE1]/20 border border-[#4CE3BC]/30 flex items-center justify-center mb-8 text-[#4CE3BC]">
            <feature.icon size={28} />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
            {feature.title}
          </h2>
          <p className="text-lg text-zinc-400 font-medium leading-relaxed max-w-md">
            {feature.description}
          </p>
        </div>

        {/* Right Image */}
        <div className="w-full lg:w-1/2 relative min-h-[400px] lg:min-h-full border-t lg:border-t-0 lg:border-l border-white/10 bg-zinc-950/50 flex items-center justify-center p-6 lg:p-12 overflow-hidden">
          <div className="w-full aspect-video rounded-xl border border-white/10 shadow-2xl relative bg-zinc-900 group overflow-hidden">
             
             {/* Fake browser window chrome */}
             <div className="absolute top-0 left-0 right-0 h-8 bg-zinc-950/90 border-b border-white/5 flex items-center px-4 gap-2 z-20 backdrop-blur-md">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50 border border-red-500/20"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50 border border-yellow-500/20"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50 border border-green-500/20"></div>
             </div>
             
             {/* Scroll-scaling Image with additional Hover Scale */}
             <div className="absolute inset-x-0 bottom-0 top-8 overflow-hidden rounded-b-xl flex justify-center items-start origin-top transition-transform duration-700 ease-out group-hover:scale-[1.03]">
               <motion.img 
                 style={{ scale: imageScale }}
                 src={feature.image} 
                 alt={feature.title} 
                 className="w-full h-full object-contain object-top opacity-90 group-hover:opacity-100 transition-opacity duration-500 origin-top"
               />
             </div>
             
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const NAV_LINKS = [
  { label: 'System', href: '#system' },
  { label: 'Intelligence', href: '#intelligence' },
  { label: 'Security', href: '#security' },
];

const FEATURES = [
  {
    icon: Briefcase,
    title: 'Brand Operations',
    description: 'A unified control center for enterprise-level creator partnerships. Manage every deliverable with precision.',
    image: '/landing/dash_main.png'
  },
  {
    icon: DollarSign,
    title: 'Revenue Engine',
    description: 'Automated income tracking and underpricing detection. Turn your creative output into a predictable financial system.',
    image: '/landing/dash_deals.png'
  },
  {
    icon: BarChart3,
    title: 'Macro Intelligence',
    description: 'Deep-dive analytics into audience value and platform ROI. Make decisions based on data, not intuition.',
    image: '/landing/dash_analytics.png'
  }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#E4E4E7] selection:bg-[#4CE3BC] selection:text-black font-sans antialiased overflow-x-hidden">
      
      {/* Subtle Grid Background */}
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-white/5 bg-[#0A0A0B]/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4CE3BC] to-[#25AAE1] flex items-center justify-center font-black text-black text-sm">C</div>
            <span className="text-lg font-bold tracking-tight text-white">CreBoard</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(link => (
              <a key={link.label} href={link.href} className="text-xs font-semibold text-zinc-500 hover:text-white transition-colors uppercase tracking-widest">{link.label}</a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-xs font-bold text-zinc-400 hover:text-white transition-colors">Login</Link>
            <Link href="/dashboard" className="px-5 py-2 bg-[#4CE3BC] text-black text-[11px] font-bold rounded-full hover:bg-white transition-all uppercase tracking-wider shadow-[0_0_20px_rgba(76,227,188,0.2)]">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#4CE3BC]/20 bg-[#4CE3BC]/5 text-[10px] font-bold text-[#4CE3BC] mb-8 tracking-[0.2em] uppercase"
          >
             <Sparkles size={10}/> The Creator Operating System
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl md:text-8xl font-bold tracking-tight leading-[0.9] mb-8 text-white"
          >
            Own your system.<br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#4CE3BC] to-[#25AAE1]">Scale your brand.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-zinc-500 max-w-xl mx-auto mb-10 font-medium leading-relaxed"
          >
            A high-performance infrastructure designed for the modern creator business. Automate deal workflows, track real revenue, and centralize operations.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-[#4CE3BC] text-black font-bold rounded-xl hover:bg-white transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-2 group">
              Get Started <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#system" className="w-full sm:w-auto px-8 py-4 border border-zinc-800 text-white font-bold rounded-xl hover:bg-zinc-900 transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-2">
              The Platform <ChevronRight size={16} />
            </a>
          </motion.div>

          {/* Isometric Hero Preview */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden border border-white/5 shadow-2xl bg-zinc-900"
          >
             <img 
               src="/landing/dash_main.png" 
               alt="Dashboard" 
               className="w-full h-auto opacity-80"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-transparent opacity-60" />
          </motion.div>
        </div>
      </section>

      {/* Sticky Stacking Cards Feature Sections */}
      <section id="system" className="relative w-full z-10 pb-40 pt-10">
        {FEATURES.map((feature, i) => (
          <FeatureCard key={i} feature={feature} i={i} />
        ))}
      </section>

      {/* Global Security Section */}
      <section id="security" className="py-32 px-6 relative z-10 border-t border-white/5 bg-[#0D0D0E]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-1">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900 text-[10px] font-bold text-zinc-400 mb-6 tracking-widest uppercase">
                <Lock size={10}/> Enterprise Protection
             </div>
             <h3 className="text-4xl font-bold tracking-tight text-white mb-6">Your data, encrypted.</h3>
             <p className="text-zinc-500 font-medium">Built on military-grade Supabase infrastructure. Your private deal history and revenue numbers never leave your secure environment.</p>
          </div>
          
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { title: 'RLS Security', desc: 'Row Level Security ensures you only see your own data.', icon: Shield },
              { title: 'Multi-Platform', desc: 'Centralized dashboard for YouTube, Instagram, and more.', icon: Globe },
              { title: 'Zero Lag', desc: 'Real-time synchronization across all your devices.', icon: Zap },
              { title: 'Smart CRM', desc: 'Historical brand reliability insights automated.', icon: CheckCircle2 }
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-2xl bg-zinc-950/50 border border-white/5 hover:border-[#4CE3BC]/30 transition-all flex flex-col gap-4">
                <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center text-[#4CE3BC]">
                  <item.icon size={20} />
                </div>
                <h4 className="text-lg font-bold text-white">{item.title}</h4>
                <p className="text-sm text-zinc-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 px-6 text-center relative z-10 overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-10 leading-[1.1]">
            Initialize your creative<br /> operating system.
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard" className="px-10 py-5 bg-[#4CE3BC] text-black font-bold rounded-xl hover:bg-white transition-all text-sm uppercase tracking-widest flex items-center gap-2 group">
              Start Building <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#system" className="px-10 py-5 border border-zinc-800 text-white font-bold rounded-xl hover:bg-zinc-900 transition-all text-sm uppercase tracking-widest flex items-center gap-2">
              System Overview <LayoutDashboard size={18} />
            </a>
          </div>
          <p className="mt-12 text-zinc-600 text-[10px] font-bold uppercase tracking-[0.3em]">
            Deployment v1.1.0 • Global Network Active
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-white/5 bg-[#0A0A0B] z-10 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2 grayscale brightness-200">
            <div className="w-6 h-6 rounded-lg bg-zinc-500 animate-pulse" />
            <span className="font-bold text-sm tracking-tight text-white/50 uppercase">CreBoard Protocol</span>
          </div>
          <div className="flex items-center gap-8">
            <a href="#" className="text-[10px] font-bold text-zinc-600 hover:text-[#4CE3BC] transition-colors uppercase tracking-widest">Privacy</a>
            <a href="#" className="text-[10px] font-bold text-zinc-600 hover:text-[#4CE3BC] transition-colors uppercase tracking-widest">Terms</a>
            <a href="#" className="text-[10px] font-bold text-zinc-600 hover:text-[#4CE3BC] transition-colors uppercase tracking-widest">Status</a>
          </div>
          <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-widest">© 2026 CreBoard Inc.</p>
        </div>
      </footer>

    </div>
  );
}
