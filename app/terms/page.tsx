'use client';

import Link from 'next/link';
import { ArrowLeft, Book, Scale, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#E4E4E7] font-sans selection:bg-[#4CE3BC] selection:text-black antialiased relative overflow-x-hidden">
      
      {/* Premium Background Gradient */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#25AAE1]/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#4CE3BC]/10 blur-[120px]" />
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
           <h1 className="text-5xl font-black tracking-tight text-white mb-4">Terms of Service</h1>
           <p className="text-zinc-500 font-medium tracking-widest uppercase">Protocol v1.1.0 • Updated: March 31, 2026</p>
          </motion.div>

          <div className="space-y-12">
            <section className="space-y-4">
              <div className="flex items-center gap-3 text-[#4CE3BC] mb-2">
                <Book size={22} />
                <h2 className="text-xl font-bold uppercase tracking-widest">1. Protocol Acceptance</h2>
              </div>
              <div className="p-8 rounded-2xl bg-zinc-950/50 border border-white/5 backdrop-blur-sm text-zinc-400 leading-relaxed font-sm">
                By accessing or using the CreBoard platform, you agree to be bound by these Terms of Service. If you are using the platform on behalf of a creator business or enterprise, you represent that you have the authority to bind that entity to these terms.
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 text-[#25AAE1] mb-2">
                <Scale size={22} />
                <h2 className="text-xl font-bold uppercase tracking-widest">2. Usage Rights</h2>
              </div>
              <div className="p-8 rounded-2xl bg-zinc-950/50 border border-white/5 backdrop-blur-sm text-zinc-400 leading-relaxed space-y-4 font-sm">
                <p>
                  You are granted a non-exclusive, non-transferable, revocable license to access and use the CreBoard platform strictly in accordance with these terms. As a user, you agree not to:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Attempt to decompile or reverse engineer any software contained on the platform</li>
                  <li>Use the platform for any illegal purpose or in violation of creator platform community guidelines</li>
                  <li>Inhibit or restrict other creators from using the service</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 text-emerald-400 mb-2">
                <Zap size={22} />
                <h2 className="text-xl font-bold uppercase tracking-widest">3. Performance Disclaimer</h2>
              </div>
              <div className="p-8 rounded-2xl bg-zinc-950/50 border border-white/5 backdrop-blur-sm text-zinc-400 leading-relaxed font-sm">
                Our analytics engine providing historical performance predictions and revenue forecasting is intended for informational and operational efficiency purposes only. While we strive for absolute precision, past performance does not guarantee future campaign results.
              </div>
            </section>

            <section className="space-y-4">
               <h2 className="text-xl font-bold uppercase tracking-widest text-white">4. Intellectual Property</h2>
               <div className="text-zinc-400 leading-relaxed font-medium">
                  The brand marks, code architecture, and designs of the CreBoard OS are the exclusive property of CreBoard Inc. However, the data you input and the campaigns you manage remain your proprietary business intelligence.
               </div>
            </section>

            <section className="space-y-4">
               <h2 className="text-xl font-bold uppercase tracking-widest text-white">5. Termination</h2>
               <div className="text-zinc-400 leading-relaxed font-medium">
                  We reserve the right to suspend or terminate your account at our sole discretion, without notice, for conduct that we believe violates these Terms of Service or is harmful to other platform members.
               </div>
            </section>
          </div>

          <footer className="mt-24 pt-8 border-t border-white/5 text-zinc-600 text-[10px] text-center font-bold uppercase tracking-widest">
            CreBoard Protocol • All Rights Reserved
          </footer>
        </div>
      </main>
    </div>
  );
}
