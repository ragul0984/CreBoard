import { X, FileText, IndianRupee, MessageSquare, Clock } from 'lucide-react';
import { Deal } from './DealCard';

interface DealDrawerProps {
  deal: Deal | null;
  onClose: () => void;
}

const formatDateObj = (dateStr: string) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(parts[1], 10)-1]} ${parseInt(parts[2], 10)}, ${parts[0]}`;
};

export function DealDrawer({ deal, onClose }: DealDrawerProps) {
  if (!deal) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 w-[500px] bg-card border-l border-border shadow-2xl z-50 flex flex-col transform transition-transform duration-300">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center font-bold text-lg text-foreground">
               {deal.brand.charAt(0)}
            </div>
            <div>
              <h2 className="font-bold text-lg text-foreground">{deal.brand}</h2>
              <p className="text-sm text-foreground-muted font-medium">{deal.platform} • {deal.stage}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-foreground/5 text-foreground-muted transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Key Details */}
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-foreground/[0.02] p-4 rounded-xl border border-border">
               <span className="text-foreground-muted text-[10px] font-bold uppercase tracking-widest">DEAL VALUE</span>
               <div className="text-xl font-black text-success-text mt-1">₹{deal.value.toLocaleString()}</div>
             </div>
             <div className="bg-foreground/[0.02] p-4 rounded-xl border border-border">
               <span className="text-foreground-muted text-[10px] font-bold uppercase tracking-widest">DEADLINE</span>
               <div className="text-lg font-black mt-1 text-foreground">{formatDateObj(deal.deadline)}</div>
             </div>
          </div>
          
          {/* Deliverables */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2 text-foreground-muted">
               <FileText size={16} className="text-primary"/> Deliverables
            </h3>
            <div className="p-4 rounded-xl border border-border bg-foreground/[0.03] text-sm font-medium text-foreground leading-relaxed">
               {deal.deliverable}
            </div>
          </div>
          
          {/* Timeline */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2 text-foreground-muted">
               <Clock size={16} className="text-primary"/> Timeline
            </h3>
            <div className="space-y-4 pl-2 border-l-2 border-border ml-2">
               <div className="relative pl-6">
                 <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-primary" />
                 <p className="text-sm font-bold text-foreground">Stage changed to {deal.stage}</p>
                 <span className="text-[10px] font-bold text-foreground-muted">Today, 10:45 AM</span>
               </div>
               <div className="relative pl-6">
                 <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-border" />
                 <p className="text-sm font-bold text-foreground-muted">Deal Created</p>
                 <span className="text-[10px] font-bold text-foreground-subtle">Mar 15, 2026</span>
               </div>
            </div>
          </div>
          
          {/* Linked Items */}
          <div>
             <h3 className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2 text-foreground-muted">Linked Documents</h3>
             <div className="flex gap-3">
                <button className="flex-1 py-2.5 rounded-lg border border-border hover:bg-foreground/5 text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-2 transition-colors">
                  <FileText size={14} className="text-primary" /> Contract
                </button>
                <button className="flex-1 py-2.5 rounded-lg border border-border hover:bg-foreground/5 text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-2 transition-colors">
                  <IndianRupee size={14} className="text-success-text" /> Invoice
                </button>
             </div>
          </div>

          {/* Notes Log */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2 text-foreground-muted">
               <MessageSquare size={16} className="text-primary"/> Conversation & Notes
            </h3>
            <div className="flex gap-2">
               <input type="text" placeholder="Add a note..." className="flex-1 px-3 py-2.5 rounded-lg border border-border bg-foreground/5 focus:outline-none focus:border-primary text-sm font-medium text-foreground" />
               <button className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-hover transition-colors shadow-md">Post</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
