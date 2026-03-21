'use client';
import Link from 'next/link';
import { ArrowRight, BarChart3, Briefcase, DollarSign, Zap, Star, ChevronRight, Sparkles, TrendingUp, Users, Calendar, Shield } from 'lucide-react';
import { useState } from 'react';

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Workflow', href: '#how-it-works' },
  { label: 'Testimonials', href: '#testimonials' },
];

const FEATURES = [
  {
    icon: Briefcase,
    title: 'Brand Deal Management',
    description: 'A visual control center for every partnership. Track leads, deliverables, and payment status in one matte-finished board.',
  },
  {
    icon: DollarSign,
    title: 'Revenue Intelligence',
    description: 'Deep analytics into your income streams. Identify underpricing and discover your most profitable platforms instantly.',
  },
  {
    icon: BarChart3,
    title: 'Automated Tracking',
    description: 'Real-time monitoring of invoice health. Get alerted the second a payment becomes overdue without lifting a finger.',
  },
  {
    icon: Users,
    title: 'Brand CRM',
    description: 'Build a private database of every brand you work with. Monitor their payment reliability and historical deal values.',
  },
  {
    icon: Zap,
    title: 'Smart Alerts',
    description: 'Proactive dashboard notifications that surface risks before they hit your bank account.',
  },
  {
    icon: Calendar,
    title: 'Strategic Planning',
    description: 'An integrated content calendar that syncs with your deal deadlines for a unified execution roadmap.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#f5f5f5] selection:bg-white selection:text-black">
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#1a1a1a] bg-[#050505]/70 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#f5f5f5] text-black flex items-center justify-center font-black text-sm">C</div>
            <span className="text-lg font-bold tracking-tight">CreBoard</span>
          </div>
          <div className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map(link => (
              <a key={link.label} href={link.href} className="text-[13px] text-[#888] hover:text-[#f5f5f5] transition-colors font-medium tracking-wide lowercase">{link.label}</a>
            ))}
          </div>
          <Link href="/login" className="px-6 py-2.5 bg-[#f5f5f5] text-black text-[13px] font-bold rounded-full hover:bg-[#e0e0e0] transition-all flex items-center gap-2 uppercase tracking-widest">
            Dashboard <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-48 pb-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#1a1a1a] bg-[#0a0a0a] text-[11px] font-bold text-[#666] mb-10 tracking-[0.2em] uppercase">
             Version 1.0 — Out Now
          </div>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-[0.95] mb-8 text-white">
            Own the business<br />behind your content.
          </h1>

          <p className="text-lg md:text-xl text-[#888] max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
            The operating system for modern creators. Track deals, manage payments, and monitor revenue in a workspace designed for extreme productivity.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/login" className="px-10 py-4 bg-[#f5f5f5] text-black font-bold rounded-xl hover:bg-white transition-all text-sm uppercase tracking-widest flex items-center gap-2">
              Start Building <ArrowRight size={16} />
            </Link>
            <a href="#features" className="px-10 py-4 border border-[#1a1a1a] text-[#f5f5f5] font-bold rounded-xl hover:bg-[#111] transition-all text-sm uppercase tracking-widest">
              Explore Tools
            </a>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 border-t border-[#1a1a1a]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-l border-t border-[#1a1a1a]">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="p-10 border-r border-b border-[#1a1a1a] hover:bg-[#0a0a0a] transition-colors"
                >
                  <div className="w-10 h-10 flex items-center justify-center mb-8 text-white">
                    <Icon size={32} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-white uppercase tracking-tight">{feature.title}</h3>
                  <p className="text-[#666] leading-relaxed text-[15px] font-medium">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Product Highlight */}
      <section className="py-32 px-6 bg-white text-black">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight mb-8">
                Professional tools for professional results.
              </h2>
              <p className="text-lg text-black/60 font-medium leading-relaxed mb-10">
                Spreadsheets aren't enough when your business scales. CreBoard gives you a purpose-built workspace that handles the heavy lifting of CRM and revenue tracking so you can focus on creation.
              </p>
              <ul className="space-y-4">
                {['Real-time Payment Tracking', 'Dynamic Brand Intelligence', 'Integrated Revenue Analytics'].map(item => (
                  <li key={item} className="flex items-center gap-4 font-bold text-sm tracking-widest uppercase">
                    <div className="w-5 h-5 bg-black text-white flex items-center justify-center rounded-sm"><ArrowRight size={12} /></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="aspect-square bg-black rounded-3xl p-1 shadow-2xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
               <div className="w-full h-full bg-[#111] border border-white/5 rounded-2xl flex items-center justify-center text-white/10 font-black text-8xl uppercase tracking-tighter italic">
                 Matte OS
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-48 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-10">Ready to scale?</h2>
          <Link href="/dashboard" className="px-12 py-5 bg-[#f5f5f5] text-black font-black rounded-full hover:bg-white transition-all text-lg uppercase tracking-widest shadow-2xl">
            Get Instant Access
          </Link>
          <div className="mt-12 text-[#666] text-xs font-bold uppercase tracking-[0.3em]">
            No Subscription — Forever Free for Solo Creators
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-[#1a1a1a]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-3">
             <div className="w-6 h-6 rounded bg-white text-black flex items-center justify-center font-black text-[10px]">C</div>
             <span className="font-bold text-sm tracking-widest uppercase">CreBoard</span>
          </div>
          <div className="flex items-center gap-12">
            {NAV_LINKS.map(link => (
              <a key={link.label} href={link.href} className="text-xs text-[#444] hover:text-[#f5f5f5] transition-colors font-bold uppercase tracking-widest">{link.label}</a>
            ))}
          </div>
          <div className="text-[10px] text-[#444] font-bold uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} / Design by CreBoard
          </div>
        </div>
      </footer>

    </div>
  );
}
