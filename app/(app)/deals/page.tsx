'use client';
import { useState, useMemo } from 'react';
import { Search, SortDesc, Plus } from 'lucide-react';
import { KanbanBoard } from '@/components/deals/KanbanBoard';
import { Deal } from '@/src/store';
import { NewDealModal } from '@/components/deals/NewDealModal';
import { useStore } from '@/src/store';

export default function DealsPage() {
  const deals = useStore(state => state.deals);
  const addDeal = useStore(state => state.addDeal);
  const updateDealStage = useStore(state => state.updateDealStage);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<'deadline' | 'value' | null>(null);
  const [isNewDealOpen, setIsNewDealOpen] = useState(false);

  // Derived calculations
  const totalBoardValue = deals.reduce((sum, d) => sum + d.value, 0);
  const activeDealsCount = deals.filter(d => d.stage !== 'Lost' && d.stage !== 'Paid' && d.stage !== 'Delivered').length;
  const wonDealsCount = deals.filter(d => d.stage === 'Paid' || d.stage === 'Delivered').length;
  const closingRate = ((wonDealsCount / Math.max(deals.length, 1)) * 100).toFixed(0);

  const filteredAndSortedDeals = useMemo(() => {
    let result = deals;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(d => 
        d.brand.toLowerCase().includes(q) || 
        d.deliverable.toLowerCase().includes(q) ||
        d.platform.toLowerCase().includes(q)
      );
    }

    if (sortOption === 'value') {
      result = [...result].sort((a, b) => b.value - a.value);
    } else if (sortOption === 'deadline') {
      result = [...result].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    }

    return result;
  }, [deals, searchQuery, sortOption]);

  return (
    <div className="flex flex-col h-full bg-[var(--color-background)] overflow-hidden">
      <div className="shrink-0 p-6 border-b border-border bg-card/50">
        <h1 className="text-2xl font-bold mb-4">Deals Board</h1>
        <div className="flex gap-6">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-semibold tracking-wider">TOTAL BOARD VALUE</span>
            <span className="text-2xl font-bold text-success-text">₹{totalBoardValue.toLocaleString()}</span>
          </div>
          <div className="w-px bg-border my-2"></div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-semibold tracking-wider">ACTIVE DEALS</span>
            <span className="text-2xl font-bold text-primary">{activeDealsCount}</span>
          </div>
          <div className="w-px bg-border my-2"></div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-semibold tracking-wider">CLOSING RATE</span>
            <span className="text-2xl font-bold text-warning-text">{closingRate}%</span>
          </div>
        </div>
      </div>

      <div className="shrink-0 p-4 border-b border-border flex items-center justify-between bg-card text-sm w-full">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-subtle" size={16} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search deals..." 
              className="w-full pl-9 pr-4 py-1.5 rounded-lg border border-border bg-black/5 dark:bg-white/5 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          
          <button 
            onClick={() => setSortOption(sortOption === 'value' ? 'deadline' : 'value')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors font-medium ${sortOption ? 'border-primary text-primary bg-primary/10' : 'border-border text-foreground-muted hover:bg-foreground/5'}`}
          >
            <SortDesc size={14} />
            Sort: {sortOption === 'value' ? 'Value' : (sortOption === 'deadline' ? 'Deadline' : 'Default')}
          </button>
        </div>

        <button 
          onClick={() => setIsNewDealOpen(true)}
          className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white transition-colors font-medium shadow-sm"
        >
          <Plus size={16} />
          New Deal
        </button>
      </div>

      <div className="flex-1 overflow-x-hidden overflow-y-auto p-6 bg-[black]/[0.01] dark:bg-black/40">
      <KanbanBoard deals={filteredAndSortedDeals} onUpdateDealStage={updateDealStage} onDeleteDeal={state => useStore.getState().deleteDeal(state)} />
      </div>

      {isNewDealOpen && <NewDealModal onClose={() => setIsNewDealOpen(false)} onSave={(d) => addDeal(d as unknown as Deal)} />}
    </div>
  );
}
