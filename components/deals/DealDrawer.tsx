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
            <div className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/10 flex items-center justify-center font-bold text-lg text-gray-700 dark:text-gray-300">
               {deal.brand.charAt(0)}
            </div>
            <div>
              <h2 className="font-bold text-lg">{deal.brand}</h2>
              <p className="text-sm text-gray-500">{deal.platform} • {deal.stage}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-500 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Key Details */}
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-black/[0.02] dark:bg-white/[0.02] p-4 rounded-xl border border-border">
               <span className="text-gray-500 text-xs font-semibold tracking-wider">DEAL VALUE</span>
               <div className="text-xl font-bold text-success-text mt-1">₹{deal.value.toLocaleString()}</div>
             </div>
             <div className="bg-black/[0.02] dark:bg-white/[0.02] p-4 rounded-xl border border-border">
               <span className="text-gray-500 text-xs font-semibold tracking-wider">DEADLINE</span>
               <div className="text-lg font-bold mt-1 text-gray-800 dark:text-gray-200">{formatDateObj(deal.deadline)}</div>
             </div>
          </div>
          
          {/* Deliverables */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-gray-700 dark:text-gray-300">
               <FileText size={16} /> Deliverables
            </h3>
            <div className="p-4 rounded-xl border border-border bg-black/5 dark:bg-black/20 text-sm">
               {deal.deliverable}
            </div>
          </div>
          
          {/* Timeline */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-gray-700 dark:text-gray-300">
               <Clock size={16} /> Timeline
            </h3>
            <div className="space-y-4 pl-2 border-l-2 border-border ml-2">
               <div className="relative pl-6">
                 <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-primary" />
                 <p className="text-sm font-medium">Stage changed to {deal.stage}</p>
                 <span className="text-xs text-gray-500">Today, 10:45 AM</span>
               </div>
               <div className="relative pl-6">
                 <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-border" />
                 <p className="text-sm font-medium">Deal Created</p>
                 <span className="text-xs text-gray-500">Mar 15, 2026</span>
               </div>
            </div>
          </div>
          
          {/* Linked Items */}
          <div>
             <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-gray-700 dark:text-gray-300">Linked Documents</h3>
             <div className="flex gap-3">
                <button className="flex-1 py-2 rounded-lg border border-border hover:bg-black/5 dark:hover:bg-white/5 text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                  <FileText size={14} className="text-primary" /> Contract
                </button>
                <button className="flex-1 py-2 rounded-lg border border-border hover:bg-black/5 dark:hover:bg-white/5 text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                  <IndianRupee size={14} className="text-success-text" /> Invoice
                </button>
             </div>
          </div>

          {/* Notes Log */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-gray-700 dark:text-gray-300">
               <MessageSquare size={16} /> Conversation & Notes
            </h3>
            <div className="flex gap-2">
               <input type="text" placeholder="Add a note..." className="flex-1 px-3 py-2 rounded-lg border border-border bg-black/5 dark:bg-black/20 focus:outline-none focus:border-primary text-sm" />
               <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors">Post</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
