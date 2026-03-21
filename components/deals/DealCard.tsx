'use client';
import { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Calendar, CheckCircle2, Clock, AlertCircle, Edit2, ArrowRightLeft, CheckCircle, ChevronRight, Trash2, Zap } from 'lucide-react';
import { useStore } from '../../src/store';

export type Deal = {
  id: string;
  brand: string;
  platform: string;
  deliverable: string;
  value: number;
  deadline: string;
  stage: string;
  isOverdue?: boolean;
  isDueSoon?: boolean;
  isCompleted?: boolean;
};

interface DealCardProps {
  deal: Deal;
  onMoveStage: (stage: string) => void;
  onClick: () => void;
  onDeleteDeal: () => void;
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(parts[1], 10)-1]} ${parseInt(parts[2], 10)}`;
};

const STAGES = ['Lead', 'Negotiating', 'Contract Sent', 'Active', 'Delivered', 'Paid', 'Lost'];

export function DealCard({ deal, onMoveStage, onClick, onDeleteDeal }: DealCardProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMoveMenu, setShowMoveMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const payments = useStore(state => state.payments);
  const deals = useStore(state => state.deals);
  
  // Deal Intelligence Engine
  const avgDeal = deals.length ? deals.reduce((sum, d) => sum + d.value, 0) / deals.length : 0;
  const brandPayments = payments.filter(p => p.brand === deal.brand);
  const latePayments = brandPayments.filter(p => p.status === 'Overdue' || (p.receivedDate && p.dueDate && new Date(p.receivedDate) > new Date(p.dueDate))).length;

  let insight = null;
  if (!deal.isCompleted && deal.stage !== 'Lost') {
    if (deal.value > avgDeal && latePayments > 0) {
       insight = { text: "⚠️ High value, delayed payment risk", color: "text-warning-text bg-warning-bg/10 border-warning-text/20" };
    } else if (deal.value < avgDeal * 0.7 && (deal.platform.toLowerCase().includes('youtube') || deal.deliverable.toLowerCase().includes('video'))) {
       insight = { text: "🚩 Low value, high effort → avoid", color: "text-danger-text bg-danger-bg/10 border-danger-text/20" };
    } else if (deal.value > avgDeal * 1.5 && latePayments === 0 && brandPayments.length > 0) {
       insight = { text: "🔥 Top tier client", color: "text-success-text bg-success-text/10 border-success-text/20" };
    } else if (deal.value > 0 && deal.value < avgDeal * 0.8) {
       insight = { text: `Underpriced (Avg: ₹${Math.round(avgDeal).toLocaleString()})`, color: "text-gray-500 bg-gray-500/10 border-border" };
    }
  }

  // Close menus on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
        setShowMoveMenu(false);
      }
    };
    if (showDropdown || showMoveMenu) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showDropdown, showMoveMenu]);

  let indicatorLight = '';
  if (deal.isCompleted) indicatorLight = 'bg-success-text shadow-[0_0_10px_rgba(16,185,129,0.5)]';
  else if (deal.isOverdue) indicatorLight = 'bg-danger-text shadow-[0_0_10px_rgba(239,68,68,0.5)]';
  else if (deal.isDueSoon) indicatorLight = 'bg-warning-text shadow-[0_0_10px_rgba(245,158,11,0.5)]';

  return (
    <div
      className="bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow group relative cursor-pointer"
      onClick={onClick}
    >
      {indicatorLight && (
        <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${indicatorLight}`} />
      )}

      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs text-primary">
            {deal.brand.charAt(0)}
          </div>
          <div>
            <h4 className="font-bold text-sm tracking-tight leading-tight">{deal.brand}</h4>
            <p className="text-[11px] text-gray-500 leading-tight">{deal.deliverable}</p>
            {insight && (
               <div className={`px-1.5 py-0.5 mt-1.5 rounded border text-[9px] font-bold tracking-wide w-fit ${insight.color}`}>
                  {insight.text}
               </div>
            )}
          </div>
        </div>

        {/* 3-dots menu — rendered in a fixed-position container to escape overflow clipping */}
        <div ref={menuRef} className="relative z-20" onClick={e => e.stopPropagation()}>
          <button
            className="text-gray-400 hover:text-primary transition-colors p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 opacity-0 group-hover:opacity-100 focus:opacity-100"
            onClick={(e) => { e.stopPropagation(); setShowDropdown(prev => !prev); setShowMoveMenu(false); }}
          >
            <MoreHorizontal size={16} />
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-full mt-1 w-52 bg-card border border-border rounded-xl shadow-2xl z-50 py-1 overflow-hidden">
              <button
                onClick={(e) => { e.stopPropagation(); setShowDropdown(false); onClick(); }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-2"
              >
                <Edit2 size={14} /> View Details
              </button>

              <div className="border-t border-border/50 my-1" />

              {/* Move Stage sub-accordion */}
              <button
                onClick={(e) => { e.stopPropagation(); setShowMoveMenu(p => !p); }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-between"
              >
                <span className="flex items-center gap-2"><ArrowRightLeft size={14} /> Move Stage</span>
                <ChevronRight size={12} className={`transition-transform ${showMoveMenu ? 'rotate-90' : ''}`} />
              </button>

              {showMoveMenu && (
                <div className="bg-black/[0.02] dark:bg-black/30 border-t border-border/30">
                  {STAGES.map(s => (
                    <button
                      key={s}
                      onClick={(e) => { e.stopPropagation(); onMoveStage(s); setShowDropdown(false); setShowMoveMenu(false); }}
                      className={`w-full text-left px-4 py-1.5 text-xs hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-between ${deal.stage === s ? 'text-primary font-bold' : 'text-gray-600 dark:text-gray-400'}`}
                    >
                      {s}
                      {deal.stage === s && <CheckCircle2 size={12} />}
                    </button>
                  ))}
                </div>
              )}

              <div className="border-t border-border/50 my-1" />
              <button
                onClick={(e) => { e.stopPropagation(); onMoveStage('Paid'); setShowDropdown(false); }}
                className="w-full text-left px-3 py-2 text-sm text-success-text hover:bg-success-bg/20 flex items-center gap-2"
              >
                <CheckCircle size={14} /> Mark Paid
              </button>

              <div className="border-t border-border/50 my-1" />
              <button
                onClick={(e) => { e.stopPropagation(); onDeleteDeal(); setShowDropdown(false); }}
                className="w-full text-left px-3 py-2 text-sm text-danger-text hover:bg-danger-bg/20 flex items-center gap-2"
              >
                <Trash2 size={14} /> Delete Deal
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className="px-2 py-0.5 rounded border border-border bg-black/5 dark:bg-[#1b1e27] text-gray-500 dark:text-gray-400 text-[10px] font-semibold uppercase tracking-wider">{deal.platform}</span>
        <span className="font-bold text-success-text text-sm">₹{deal.value.toLocaleString()}</span>
      </div>

      {/* Stage move hint pill — visible always so user knows they can move it */}
      <div
        className="flex items-center gap-1 text-[10px] font-bold text-gray-400 dark:text-gray-600 mb-3 group-hover:text-primary transition-colors"
        onClick={e => { e.stopPropagation(); setShowDropdown(true); }}
        title="Click ··· or drag to move stage"
      >
        <ArrowRightLeft size={10} />
        <span>Drag or use ··· to move stage</span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border/50">
        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium whitespace-nowrap">
          {deal.isCompleted ? <CheckCircle2 size={12} className="text-success-text" /> : (deal.isOverdue ? <AlertCircle size={12} className="text-danger-text" /> : <Clock size={12} />)}
          <span className={deal.isOverdue ? 'text-danger-text' : (deal.isDueSoon ? 'text-warning-text' : '')}>
            {formatDate(deal.deadline)}
          </span>
        </div>
        <div className="w-5 h-5 rounded-full border border-card bg-primary text-white flex items-center justify-center text-[8px] font-bold">Me</div>
      </div>
    </div>
  );
}
