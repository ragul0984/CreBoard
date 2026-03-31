'use client';

import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#E4E4E7] font-sans selection:bg-[#4CE3BC] selection:text-black antialiased relative overflow-x-hidden">
      
      {/* Premium Background Gradient */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#4CE3BC]/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#25AAE1]/10 blur-[120px]" />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0A0A0B]/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-widest">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4CE3BC] to-[#25AAE1] flex items-center justify-center font-black text-black text-xs">C</div>
            <span className="text-sm font-bold tracking-tight text-white uppercase italic">Protocol</span>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
           <h1 className="text-5xl font-black tracking-tight text-white mb-4">Privacy Policy</h1>
           <p className="text-zinc-500 font-medium">Last Updated: March 31, 2026</p>
          </motion.div>

          <div className="space-y-12">
            <section className="space-y-4">
              <div className="flex items-center gap-3 text-[#4CE3BC] mb-2">
                <Shield size={22} />
                <h2 className="text-xl font-bold uppercase tracking-widest">1. Data Sovereignty</h2>
              </div>
              <div className="p-8 rounded-2xl bg-zinc-950/50 border border-white/5 backdrop-blur-sm text-zinc-400 leading-relaxed space-y-4">
                <p>
                  At CreBoard, we believe starting with the assumption that your data is yours—and only yours. Our infrastructure is built on military-grade encryption standards to ensure the private details of your creator business remain secure.
                </p>
                <p>
                  We collect information necessary to provide our service, including your brand deal details, historical performance data, and revenue metrics. This data is used exclusively to power the analytics and automated workflows within your private environment.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 text-[#25AAE1] mb-2">
                <Lock size={22} />
                <h2 className="text-xl font-bold uppercase tracking-widest">2. Security Architecture</h2>
              </div>
              <div className="p-8 rounded-2xl bg-zinc-950/50 border border-white/5 backdrop-blur-sm text-zinc-400 leading-relaxed space-y-4">
                <p>
                  Our platform utilizes Row Level Security (RLS) provided by Supabase. This technical architecture ensures that data access is restricted at the database level—each user's data is isolated in a secure vault that cannot be accessed by other platform members or external entities.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Encrypted transmission via TLS/SSL</li>
                  <li>Regular security audits and infrastructure monitoring</li>
                  <li>Zero-visibility principle for sensitive campaign data</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 text-purple-400 mb-2">
                <Eye size={22} />
                <h2 className="text-xl font-bold uppercase tracking-widest">3. Information Usage</h2>
              </div>
              <div className="p-8 rounded-2xl bg-zinc-950/50 border border-white/5 backdrop-blur-sm text-zinc-400 leading-relaxed space-y-4">
                <p>
                  CreBoard does not sell, rent, or lease your personal or business data to third parties. We may use anonymized, aggregated data to improve our analytics engine or generate industry insights, but this data will never be traceable back to an individual creator or specific brand campaign without explicit consent.
                </p>
              </div>
            </section>

            <section className="space-y-4">
               <h2 className="text-xl font-bold uppercase tracking-widest text-white">4. Your Rights</h2>
               <div className="text-zinc-400 leading-relaxed font-medium">
                  You have the right to access, export, or delete your data at any time. Simply use the data management tools within your dashboard or contact our protocol support team.
               </div>
            </section>
          </div>

          <footer className="mt-24 pt-8 border-t border-white/5 text-zinc-600 text-xs text-center font-bold uppercase tracking-widest">
            CreBoard Protocol • Secure Data Management
          </footer>
        </div>
      </main>
    </div>
  );
}
