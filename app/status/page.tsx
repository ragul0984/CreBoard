'use client';

import Link from 'next/link';
import { ArrowLeft, Activity, Globe, Zap, Database, Server } from 'lucide-react';
import { motion } from 'framer-motion';

const SERVICES = [
  { name: 'Global Network', status: 'Active', uptime: '99.98%', icon: Globe, color: '#4CE3BC' },
  { name: 'Analytics Engine', status: 'Operational', uptime: '100%', icon: Zap, color: '#25AAE1' },
  { name: 'Data Protocol', status: 'Secured', uptime: '99.99%', icon: Database, color: '#a855f7' },
  { name: 'Edge Nodes', status: 'Active', uptime: '99.95%', icon: Server, color: '#f43f5e' },
];

export default function StatusPage() {
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
        <div className="max-w-4xl mx-auto">
          
          <div className="flex items-end justify-between mb-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                All Systems Operational
              </div>
              <h1 className="text-5xl font-black tracking-tight text-white leading-none">System Status</h1>
            </motion.div>
            
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Protocol Version</p>
              <p className="text-sm font-mono text-[#4CE3BC]">v1.1.0-STABLE</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {SERVICES.map((service, i) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-2xl bg-zinc-950/40 border border-white/5 backdrop-blur-md relative group overflow-hidden"
              >
                {/* Status Pulse */}
                <div 
                  className="absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none" 
                  style={{ backgroundColor: service.color }} 
                />

                <div className="flex items-start justify-between mb-6">
                  <div className="p-3 rounded-xl bg-zinc-900 border border-white/5 text-white">
                    <service.icon size={20} />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Uptime (30D)</p>
                    <p className="text-lg font-mono font-bold text-white">{service.uptime}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">{service.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#4CE3BC]">{service.status}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Historical Log */}
          <div className="p-10 rounded-3xl bg-zinc-950/50 border border-white/5 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-8">
              <Activity className="text-zinc-500" size={18} />
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-500">Historical Health Log</h2>
            </div>
            
            <div className="space-y-6">
              {[
                { date: 'March 31', event: 'Protocol update v1.1.0 deployed successfully.', status: 'success' },
                { date: 'March 29', event: 'Database migration completed without latency.', status: 'success' },
                { date: 'March 25', event: 'Maintenance: Edge node optimization in North America.', status: 'info' }
              ].map((log, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <span className="text-[10px] font-mono text-zinc-600 uppercase mt-1 min-w-[70px]">{log.date}</span>
                  <div className="flex-1 pb-6 border-b border-white/5">
                    <p className="text-sm font-medium text-zinc-400">{log.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <footer className="mt-20 pt-8 text-center">
            <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-[0.4em]">CreBoard Foundation • Network Operations</p>
          </footer>
        </div>
      </main>
    </div>
  );
}
