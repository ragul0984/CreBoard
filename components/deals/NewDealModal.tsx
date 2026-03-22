'use client';
import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Deal } from './DealCard';
import { useStore } from '../../src/store';

export function NewDealModal({ onClose, onSave }: { onClose: () => void, onSave: (deal: Deal) => void }) {
   const [brand, setBrand] = useState('');
   const [platform, setPlatform] = useState('Instagram');
   const [stage, setStage] = useState('Lead');
   const [value, setValue] = useState<number | ''>('');
   const [deadline, setDeadline] = useState(new Date().toISOString().split('T')[0]);
   const [deliverable, setDeliverable] = useState('');

   const deals = useStore(state => state.deals);
   const avgDeal = deals.length ? deals.reduce((sum, d) => sum + d.value, 0) / deals.length : 0;
   const isUnderpriced = typeof value === 'number' && value > 0 && avgDeal > 0 && value < avgDeal * 0.8;

   const STAGES = ['Lead', 'Negotiating', 'Contract Sent', 'Active', 'Delivered', 'Paid', 'Lost'];

   const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     if(!brand || typeof value !== 'number') return;
     
     onSave({
       id: Math.random().toString(36).substring(7),
       brand,
       platform,
       deliverable,
       value: Number(value),
       deadline,
       stage
     });
     onClose();
   };

   return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
         <div className="bg-card border border-border rounded-2xl w-[500px] max-w-full p-6 shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button onClick={onClose} className="absolute right-4 top-4 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-foreground-muted transition-colors cursor-pointer">
              <X size={18} />
            </button>
            <h2 className="text-xl font-bold mb-6 text-foreground">Create New Deal</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider">Brand Name</label>
                   <input required type="text" value={brand} autoFocus onChange={e => setBrand(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-foreground/5 border border-border focus:outline-none focus:border-primary text-sm font-medium text-foreground" placeholder="e.g. Adobe" />
                 </div>
                 <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider">Platform</label>
                   <input required type="text" value={platform} onChange={e => setPlatform(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-foreground/5 border border-border focus:outline-none focus:border-primary text-sm font-medium text-foreground" placeholder="e.g. YouTube" />
                 </div>
              </div>
              <div className="space-y-1.5">
                 <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider">Deliverables</label>
                 <input required type="text" value={deliverable} onChange={e => setDeliverable(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-foreground/5 border border-border focus:outline-none focus:border-primary text-sm font-medium text-foreground" placeholder="e.g. 1x 60s Reel, 2x Stories" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider">Value (₹)</label>
                   <input required type="number" min="0" value={value} onChange={e => setValue(Number(e.target.value))} className={`w-full px-3 py-2 rounded-lg bg-foreground/5 border focus:outline-none text-sm font-medium text-foreground ${isUnderpriced ? 'border-warning-text focus:border-warning-text' : 'border-border focus:border-primary'}`} placeholder="0" />
                   {isUnderpriced && (
                     <div className="mt-1.5 flex items-start gap-1.5 text-warning-text bg-warning-bg/10 border border-warning-text/20 rounded-lg px-2.5 py-1.5">
                       <AlertTriangle size={13} className="shrink-0 mt-0.5" strokeWidth={2.5}/>
                       <p className="text-[11px] font-bold leading-tight">Your avg deal = ₹{Math.round(avgDeal).toLocaleString()}. This deal is ₹{typeof value === 'number' ? value.toLocaleString() : 0} → <span className="underline">underpriced</span></p>
                     </div>
                   )}
                 </div>
                 <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider">Deadline</label>
                   <input required type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-foreground/5 border border-border focus:outline-none focus:border-primary text-sm font-medium text-foreground" />
                 </div>
              </div>
              <div className="space-y-1.5">
                 <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider">Initial Board Stage</label>
                 <select value={stage} onChange={e => setStage(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-foreground/5 border border-border focus:outline-none focus:border-primary text-sm font-medium appearance-none cursor-pointer text-foreground">
                    {STAGES.map(s => <option key={s} value={s} className="bg-card text-foreground">{s}</option>)}
                 </select>
              </div>

              <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-border">
                <button type="button" onClick={onClose} className="px-5 py-2 hover:bg-foreground/5 transition-colors rounded-lg text-sm font-bold text-foreground-muted">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-bold shadow-md transition-colors cursor-pointer">Create Deal</button>
              </div>
            </form>
         </div>
      </div>
   );
}
