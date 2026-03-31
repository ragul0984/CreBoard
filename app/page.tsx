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
  const { theme, systemTheme } = useTheme();
  const isDark = (theme === 'system' ? systemTheme : theme) === 'dark';
  
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
        className="w-full max-w-6xl aspect-auto lg:aspect-[2/1] bg-white dark:bg-[#0A0A0B] rounded-[40px] border border-zinc-200 dark:border-white/5 shadow-2xl dark:shadow-[0_-20px_60px_rgba(0,0,0,0.6)] flex flex-col lg:flex-row overflow-hidden absolute"
        style={{
          top: `calc(10vh + ${i * 40}px)`, 
          height: '80vh'
        }}
        initial={{ opacity: 0, y: 150 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Left Content bg-transparent allows the fixed background to show through */}
        <div className="w-full lg:w-1/2 p-10 lg:p-20 flex flex-col justify-center relative z-20 bg-transparent">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4CE3BC]/20 to-[#25AAE1]/20 border border-[#4CE3BC]/30 flex items-center justify-center mb-8 text-[#4CE3BC]">
            <feature.icon size={28} />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6">
            {feature.title}
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed max-w-md">
            {feature.description}
          </p>
        </div>

        {/* Right Image */}
        <div className="w-full lg:w-1/2 relative min-h-[400px] lg:min-h-full border-t lg:border-t-0 lg:border-l border-zinc-200 dark:border-white/10 bg-zinc-100/50 dark:bg-zinc-950/50 flex items-center justify-center p-6 lg:p-12 overflow-hidden">
          <div className="w-full aspect-video rounded-xl border border-zinc-200 dark:border-white/10 shadow-2xl relative bg-white dark:bg-zinc-900 group overflow-hidden">
             
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
    image: '/landing/dash_deals.png'
  },
  {
    icon: BarChart3,
    title: 'Revenue Engine',
    description: 'Real-time financial visibility. Track your earnings across every platform and campaign automatically.',
    image: '/landing/dash_analytics.png'
  },
  {
    icon: Zap,
    title: 'Macro Intelligence',
    description: 'Data-driven insights to scale your brand. Use historical performance to predict future deal value.',
    image: '/landing/dash_main.png'
  }
];

const GRID_FEATURES = [
  {
    icon: '🎯',
    title: 'Deal Tracker',
    description: 'Organize all your brand collaborations in one place with clear deal details and status tracking.',
  },
  {
    icon: '💰',
    title: 'Payment Tracking',
    description: 'Monitor every payment, from pending to received, and never miss a payment again.',
  },
  {
    icon: '📈',
    title: 'Revenue Dashboard',
    description: 'Get real-time insights into your total revenue, earnings trends, and income sources.',
  },
  {
    icon: '👥',
    title: 'Brand CRM',
    description: 'Keep all brand contacts, collaboration history, and communication details organized.',
  },
  {
    icon: '📄',
    title: 'Invoice Generator',
    description: 'Create professional invoices in seconds and send them directly to brands.',
  },
  {
    icon: '⚖️',
    title: 'Contract AI',
    description: 'AI-powered contract review and suggestions to protect your interests.',
  },
  {
    icon: '🤖',
    title: 'AI Pricing',
    description: 'Smart pricing suggestions based on your audience and content performance.',
    comingSoon: true,
  },
  {
    icon: '🏪',
    title: 'Brand Marketplace',
    description: 'Discover brand collaboration opportunities that match your audience.',
    comingSoon: true,
  }
];


import BorderGlow from '@/components/ui/BorderGlow';

import DarkVeil from '@/components/ui/DarkVeil';
import GlareHover from '@/components/ui/GlareHover';

import { useTheme } from 'next-themes';

export default function LandingPage() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return <div className="min-h-screen bg-[#0A0A0B]" />;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0A0A0B] text-zinc-900 dark:text-[#E4E4E7] selection:bg-[#4CE3BC] selection:text-black font-sans antialiased overflow-x-hidden transition-colors duration-300">
      
      {/* Dynamic WebGL Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 dark:opacity-40">
        <DarkVeil
          hueShift={isDark ? 0 : 200}
          noiseIntensity={0}
          scanlineIntensity={0}
          speed={0.5}
          scanlineFrequency={0}
          warpAmount={0}
          resolutionScale={1}
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-zinc-200 dark:border-white/5 bg-white/80 dark:bg-[#0A0A0B]/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4CE3BC] to-[#25AAE1] flex items-center justify-center font-black text-black text-sm">C</div>
            <span className="text-lg font-bold tracking-tight text-white">CreBoard</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(link => (
              <a key={link.label} href={link.href} className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors uppercase tracking-widest">{link.label}</a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">Login</Link>
            <Link href="/dashboard" className="px-5 py-2 bg-zinc-900 dark:bg-[#4CE3BC] text-white dark:text-black text-[11px] font-bold rounded-lg hover:scale-105 transition-all uppercase tracking-wider shadow-xl shadow-black/10 dark:shadow-[#4CE3BC]/20">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#4CE3BC]/30 bg-[#4CE3BC]/10 text-[10px] font-bold text-[#4CE3BC] mb-8 tracking-widest uppercase"
          >
            <Sparkles size={12}/> The Creator Operating System
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-black tracking-tighter text-zinc-900 dark:text-white mb-8 leading-[0.9]"
          >
            Own your <span className="text-zinc-400 dark:text-zinc-600">system.</span><br />
            Scale your <span className="bg-gradient-to-r from-[#4CE3BC] to-[#25AAE1] bg-clip-text text-transparent italic">brand.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed"
          >
            A high-performance infrastructure designed for the modern creator business. Automate deal workflows, track real revenue, and centralize operations.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <Link href="/dashboard" className="px-8 py-4 bg-[#4CE3BC] text-black font-bold rounded-xl hover:bg-white transition-all text-xs uppercase tracking-widest flex items-center gap-2 group">
              Get Started <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#system" className="px-8 py-4 border border-zinc-800 text-white font-bold rounded-xl hover:bg-zinc-900 transition-all text-xs uppercase tracking-widest flex items-center gap-2">
              The Platform <ChevronRight size={16} />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="relative max-w-5xl mx-auto"
          >
            <div className="absolute inset-x-0 -top-40 -bottom-40 bg-gradient-to-t from-[#0A0A0B] via-transparent to-transparent z-20 pointer-events-none" />
            <div className="relative rounded-3xl border border-white/10 bg-zinc-900 shadow-2xl overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-tr from-[#4CE3BC]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
               <img src="/landing/dash_main.png" alt="Dashboard Preview" className="w-full relative z-10 scale-105 group-hover:scale-100 transition-transform duration-[2s] ease-out" />
            </div>
            
            {/* Ambient Glow */}
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-[#4CE3BC]/20 blur-[120px] rounded-full pointer-events-none z-0" />
          </motion.div>
        </div>
      </section>

      {/* Sticky Stacking Cards Feature Sections */}
      <section id="system" className="relative w-full z-10 pb-40 pt-10">
        {FEATURES.map((feature, i) => (
          <FeatureCard key={i} feature={feature} i={i} />
        ))}
      </section>

      {/* Powerful Features Grid */}
      <section className="py-32 px-6 relative z-10 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white text-center mb-16">
            Powerful features for creators
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {GRID_FEATURES.map((feature, i) => (
              <BorderGlow
                key={i} 
                className="p-8 h-full flex flex-col items-start gap-3"
                borderRadius={16}
                backgroundColor={isDark ? '#121316' : '#ffffff'}
                colors={isDark ? ['#4CE3BC', '#25AAE1', '#a855f7'] : ['#4CE3BC', '#25AAE1', '#6366f1']}
                animated={i === 0}
              >
                <div className="text-3xl mb-1">
                  {feature.icon}
                </div>
                
                {feature.comingSoon && (
                  <span className="inline-flex px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 font-bold uppercase tracking-widest text-[10px]">
                    Coming Soon
                  </span>
                )}
                
                <h3 className="text-[19px] font-bold text-zinc-900 dark:text-white leading-tight">
                  {feature.title}
                </h3>
                
                <p className="text-[14px] text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                  {feature.description}
                </p>
              </BorderGlow>
            ))}
          </div>
        </div>
      </section>

      {/* Global Security Section */}
      <section id="security" className="py-32 px-6 relative z-10 border-t border-white/5 bg-transparent">
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
              <GlareHover
                key={i}
                className="flex flex-col gap-4 p-8"
                background={isDark ? "rgba(9, 9, 11, 0.5)" : "rgba(255, 255, 255, 0.8)"}
                borderColor={isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"}
                borderRadius="16px"
                glareColor={isDark ? "#4CE3BC" : "#25AAE1"}
                glareOpacity={isDark ? 0.15 : 0.08}
                transitionDuration={1000}
              >
                <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center text-[#4CE3BC]">
                  <item.icon size={20} />
                </div>
                <h4 className="text-lg font-bold text-white">{item.title}</h4>
                <p className="text-sm text-zinc-500">{item.desc}</p>
              </GlareHover>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 px-6 text-center relative z-10 overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 dark:text-white mb-10 leading-[1.1]">
            Initialize your creative<br /> operating system.
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard" className="px-10 py-5 bg-zinc-900 dark:bg-[#4CE3BC] text-white dark:text-black font-bold rounded-xl hover:scale-105 transition-all text-sm uppercase tracking-widest flex items-center gap-2 group shadow-xl shadow-black/10">
              Start Building <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#system" className="px-10 py-5 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white font-bold rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all text-sm uppercase tracking-widest flex items-center gap-2">
              System Overview <LayoutDashboard size={18} />
            </a>
          </div>
          <p className="mt-12 text-zinc-500 dark:text-zinc-600 text-[10px] font-bold uppercase tracking-[0.3em]">
            Deployment v1.1.0 • Global Network Active
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-zinc-200 dark:border-white/5 bg-transparent z-10 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2 grayscale brightness-100 dark:brightness-200">
            <div className="w-6 h-6 rounded-lg bg-zinc-400 animate-pulse" />
            <span className="font-bold text-sm tracking-tight text-zinc-400 dark:text-white/50 uppercase">CreBoard Protocol</span>
          </div>
          <div className="flex items-center gap-8">
            <a href="#" className="text-[10px] font-bold text-zinc-400 hover:text-[#4CE3BC] dark:text-zinc-600 transition-colors uppercase tracking-widest">Privacy</a>
            <a href="#" className="text-[10px] font-bold text-zinc-400 hover:text-[#4CE3BC] dark:text-zinc-600 transition-colors uppercase tracking-widest">Terms</a>
            <a href="#" className="text-[10px] font-bold text-zinc-400 hover:text-[#4CE3BC] dark:text-zinc-600 transition-colors uppercase tracking-widest">Status</a>
          </div>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-700 font-bold uppercase tracking-widest">© 2026 CreBoard Inc.</p>
        </div>
      </footer>

    </div>
  );
}
