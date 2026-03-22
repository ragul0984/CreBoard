'use client';
import { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Youtube, Instagram, Sparkles, Plus, Filter, Type, X, FileText, CornerDownRight, Trash2 } from 'lucide-react';
import { RevenueLineChart } from '@/components/revenue/RevenueLineChart';
import { useStore, RevenueRecord } from '@/src/store';

const getPlatformIcon = (platform: string) => {
  const p = platform.toLowerCase();
  if (p.includes('youtube')) return <Youtube size={14} className="text-red-500"/>;
  if (p.includes('instagram')) return <Instagram size={14} className="text-pink-500"/>;
  if (p.includes('newsletter') || p.includes('type')) return <Type size={14} className="text-blue-500"/>;
  return <Sparkles size={14} className="text-warning-text"/>;
};

const getPlatformIconBg = (platform: string) => {
  const p = platform.toLowerCase();
  if (p.includes('youtube')) return 'bg-red-500/10 text-red-500';
  if (p.includes('instagram')) return 'bg-pink-500/10 text-pink-500';
  if (p.includes('newsletter') || p.includes('type')) return 'bg-blue-500/10 text-blue-500';
  return 'bg-warning-text/10 text-warning-text';
};

const formatDateObj = (dateStr: string) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(parts[1], 10)-1]} ${parseInt(parts[2], 10)}, ${parts[0]}`;
};

export default function RevenueHub() {
  const ledger = useStore(state => state.revenue);
  const addRevenue = useStore(state => state.addRevenue);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedLedgerItem, setSelectedLedgerItem] = useState<RevenueRecord | null>(null);
  
  // Add Revenue Form State
  const [platform, setPlatform] = useState('YouTube');
  const [customPlatform, setCustomPlatform] = useState('');
  const [type, setType] = useState('Ad Revenue');
  const [amount, setAmount] = useState<number | ''>('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const handleSave = (e: any) => {
    e.preventDefault();
    if (!amount) return;
    
    const finalPlatform = platform === 'Other' ? (customPlatform || 'Custom') : platform;

    const newEntry: RevenueRecord = {
      id: Math.random().toString(36).substring(7),
      date,
      platform: finalPlatform,
      type,
      amount: Number(amount),
      notes: notes || 'Manual entry',
      source: 'manual'
    };

    addRevenue(newEntry);
    setIsAddOpen(false);
    setAmount('');
    setCustomPlatform('');
    setNotes('');
  };

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;

  const totalThisMonth = ledger.filter(r => {
    const [y, m] = r.date.split('-');
    return parseInt(m, 10) === currentMonth && parseInt(y, 10) === currentYear;
  }).reduce((sum, item) => sum + item.amount, 0);

  const totalLastMonth = ledger.filter(r => {
    const [y, m] = r.date.split('-');
    return parseInt(m, 10) === lastMonth && parseInt(y, 10) === lastMonthYear;
  }).reduce((sum, item) => sum + item.amount, 0);

  const growthObj = totalLastMonth === 0 ? (totalThisMonth > 0 ? 100 : 0) : Math.round(((totalThisMonth - totalLastMonth) / totalLastMonth) * 100);
  const isGrowthPositive = growthObj >= 0;

  const platformTotals: Record<string, number> = {};
  ledger.forEach(r => platformTotals[r.platform] = (platformTotals[r.platform] || 0) + r.amount);
  const bestPlatform = Object.entries(platformTotals).sort((a, b) => b[1] - a[1])[0] || ['None', 0];

  const typeTotals: Record<string, number> = {};
  ledger.forEach(r => typeTotals[r.type] = (typeTotals[r.type] || 0) + r.amount);
  const topStream = Object.entries(typeTotals).sort((a, b) => b[1] - a[1])[0] || ['None', 0];

  const timelineMap: Record<string, number> = {};
  [...ledger].filter(r => {
    const [y, m] = r.date.split('-');
    return parseInt(m, 10) === currentMonth && parseInt(y, 10) === currentYear;
  }).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).forEach(r => {
     const formatted = formatDateObj(r.date).split(',')[0];
     timelineMap[formatted] = (timelineMap[formatted] || 0) + r.amount;
  });
  const lineData = Object.keys(timelineMap).map(k => ({ date: k, amount: timelineMap[k] }));

  const insightStr = totalThisMonth === 0 && totalLastMonth === 0 ? 'No revenue recorded recently.' : 
    `Revenue ${isGrowthPositive ? 'increased' : 'decreased'} ${Math.abs(growthObj)}% this month. Most income came from ${topStream[0].toLowerCase()}.`;

  return (
    <div className="p-5 max-w-[1400px] mx-auto space-y-5 bg-[var(--color-background)] min-h-screen">
      
      {/* Revenue Details Modal */}
      {selectedLedgerItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setSelectedLedgerItem(null)}>
           <div className="bg-card border border-border rounded-2xl w-[450px] shadow-2xl relative overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b border-border flex justify-between items-center bg-black/5 dark:bg-black/20">
                 <h2 className="text-lg font-bold flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${getPlatformIconBg(selectedLedgerItem.platform)}`}>
                       {getPlatformIcon(selectedLedgerItem.platform)}
                    </div> 
                    Transaction Details
                 </h2>
                 <button onClick={() => setSelectedLedgerItem(null)} className="text-gray-500 hover:text-black dark:hover:text-white transition-colors bg-black/5 dark:bg-white/5 p-1 rounded-md">
                    <X size={16} strokeWidth={3} />
                 </button>
              </div>
              <div className="p-6 space-y-5">
                 <div className="text-center pb-5 border-b border-border">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Total Amount</div>
                    <div className="text-4xl font-black text-success-text tracking-tighter">₹{selectedLedgerItem.amount.toLocaleString()}</div>
                    <div className="text-xs text-gray-500 font-medium mt-2">Logged on {formatDateObj(selectedLedgerItem.date)}</div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-border/50 shadow-inner">
                       <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Platform</div>
                       <div className="text-sm font-bold text-gray-800 dark:text-gray-200">{selectedLedgerItem.platform}</div>
                    </div>
                    <div className="bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-border/50 shadow-inner">
                       <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Income Type</div>
                       <div className="text-sm font-bold text-gray-800 dark:text-gray-200">{selectedLedgerItem.type}</div>
                    </div>
                 </div>

                 <div className="bg-black/[0.02] dark:bg-white/[0.02] p-4 rounded-xl border border-border/50 space-y-4">
                    <div>
                       <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Origin Workflow</div>
                       <div className="text-sm font-bold flex items-center gap-2">
                          {selectedLedgerItem.source === 'deal' ? (
                             <span className="bg-primary/10 border border-primary/20 text-primary px-2.5 py-1 rounded-md text-xs tracking-wide">Dynamic: CRM Deal Board</span>
                          ) : (
                             <span className="bg-gray-500/10 border border-gray-500/20 text-foreground-muted px-2.5 py-1 rounded-md text-xs tracking-wide">Manual: Direct Income Entry</span>
                          )}
                       </div>
                    </div>

                    <div>
                       <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Ledger Notes</div>
                       <div className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-relaxed bg-black/5 dark:bg-black/40 px-3 py-2.5 rounded-lg border border-border shadow-inner">
                          {selectedLedgerItem.notes || 'No description provided.'}
                       </div>
                    </div>
                    
                    {selectedLedgerItem.source === 'deal' && (
                      <div className="flex items-center gap-2 text-xs font-bold text-primary cursor-pointer hover:underline mt-4 pt-4 border-t border-border">
                         <FileText size={14} /> Navigate to Linked Invoice
                      </div>
                    )}
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Smart Insights Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Revenue Hub</h1>
          <div className="flex items-center gap-1.5 text-xs bg-black/5 dark:bg-white/5 border border-border px-2.5 py-1 rounded w-fit">
             <Sparkles size={14} className="text-warning-text shrink-0" />
             <span className="text-gray-600 dark:text-gray-300 font-medium leading-tight">
               Insight: <strong className={isGrowthPositive ? "text-success-text" : "text-danger-text"}>{insightStr}</strong>
             </span>
          </div>
        </div>
        <button 
          onClick={() => setIsAddOpen(!isAddOpen)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white transition-colors text-sm font-semibold shadow-sm shrink-0"
        >
          <Plus size={16} /> Add Revenue
        </button>
      </div>

      {/* Add Revenue Form (Inline) */}
      {isAddOpen && (
        <div className="bg-card border border-primary/20 rounded-xl p-5 shadow-lg mb-5 animate-in slide-in-from-top-4 fade-in duration-200">
           <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-base flex items-center gap-2 text-primary">
                <DollarSign size={16} className="bg-primary/10 rounded-full p-0.5" /> 
                Record Income Stream
              </h2>
           </div>
           
           <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
              <div className="space-y-1">
                 <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Platform</label>
                 <select value={platform} onChange={e=>setPlatform(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-black/5 dark:bg-white/5 border border-border focus:outline-none focus:border-primary text-sm font-medium appearance-none cursor-pointer">
                    <option className="bg-card">YouTube</option>
                    <option className="bg-card">Instagram</option>
                    <option className="bg-card">TikTok</option>
                    <option className="bg-card">Brand Deal</option>
                    <option className="bg-card">Other</option>
                 </select>
              </div>
              
              {platform === 'Other' && (
                <div className="space-y-1">
                   <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Custom Platform</label>
                   <input required type="text" value={customPlatform} onChange={e=>setCustomPlatform(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-black/5 dark:bg-white/5 border border-border focus:outline-none focus:border-primary text-sm font-medium" placeholder="e.g. Patreon" />
                </div>
              )}

              <div className="space-y-1">
                 <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Source Type</label>
                 <select value={type} onChange={e=>setType(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-black/5 dark:bg-white/5 border border-border focus:outline-none focus:border-primary text-sm font-medium appearance-none cursor-pointer">
                    <option className="bg-card">Ad Revenue</option>
                    <option className="bg-card">Sponsorship</option>
                    <option className="bg-card">Affiliate</option>
                    <option className="bg-card">Merch</option>
                 </select>
              </div>
              
              <div className="space-y-1">
                 <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Amount (₹)</label>
                 <input required type="number" min="0" value={amount} onChange={e=>setAmount(Number(e.target.value) || '')} className="w-full px-3 py-2 rounded-lg bg-black/5 dark:bg-white/5 border border-border focus:outline-none focus:border-primary text-sm font-medium" placeholder="0" />
              </div>
              
              <div className="space-y-1">
                 <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Date</label>
                 <input required type="date" value={date} onChange={e=>setDate(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-black/5 dark:bg-white/5 border border-border focus:outline-none focus:border-primary text-sm font-medium text-gray-700 dark:text-gray-300" />
              </div>

              <div className="space-y-1 md:col-span-1">
                 <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Notes</label>
                 <input type="text" value={notes} onChange={e=>setNotes(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-black/5 dark:bg-white/5 border border-border focus:outline-none focus:border-primary text-sm font-medium" placeholder="Optional" />
              </div>

              <div className="flex gap-2 md:col-span-6 justify-end mt-2 pt-4 border-t border-border">
                 <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 text-gray-600 dark:text-gray-300 rounded-lg text-sm font-bold transition-colors">Cancel</button>
                 <button type="submit" className="px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-bold shadow-md transition-colors">Save Income</button>
              </div>
           </form>
        </div>
      )}

      {/* 1. Top Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border p-5 rounded-xl flex flex-col relative overflow-hidden group hover:border-primary/50 transition-colors">
          <span className="text-[10px] font-bold tracking-widest text-gray-500 mb-1">TOTAL (THIS MONTH)</span>
          <div className="text-2xl font-bold text-success-text tracking-tight mb-1">₹{totalThisMonth.toLocaleString()}</div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
             <div className={isGrowthPositive ? "bg-success-bg text-success-text p-0.5 rounded" : "bg-danger-bg text-danger-text p-0.5 rounded"}>
               {isGrowthPositive ? <TrendingUp size={12} strokeWidth={3} /> : <TrendingDown size={12} strokeWidth={3} />}
             </div>
             <span className={isGrowthPositive ? "text-success-text font-bold" : "text-danger-text font-bold"}>{isGrowthPositive ? '+' : ''}{growthObj}%</span> vs last month
          </div>
        </div>
        <div className="bg-card border border-border p-5 rounded-xl flex flex-col relative overflow-hidden">
          <span className="text-[10px] font-bold tracking-widest text-gray-500 mb-1">LAST MONTH</span>
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-200 tracking-tight mb-1">₹{totalLastMonth.toLocaleString()}</div>
          <div className="text-xs text-gray-500 font-medium">Historical baseline</div>
        </div>
        <div className="bg-card border border-border p-5 rounded-xl flex flex-col relative overflow-hidden">
          <span className="text-[10px] font-bold tracking-widest text-gray-500 mb-1">BEST PLATFORM</span>
          <div className="text-2xl font-bold text-primary tracking-tight mb-1 flex items-center gap-2">
             <div className={`p-1 rounded-lg ${getPlatformIconBg(bestPlatform[0])}`}>{getPlatformIcon(bestPlatform[0])}</div> {bestPlatform[0]}
          </div>
          <div className="text-xs text-gray-500 font-medium">₹{bestPlatform[1].toLocaleString()} generated</div>
        </div>
        <div className="bg-card border border-border p-5 rounded-xl flex flex-col relative overflow-hidden">
          <span className="text-[10px] font-bold tracking-widest text-gray-500 mb-1">TOP INCOME STREAM</span>
          <div className="text-2xl font-bold text-warning-text tracking-tight mb-1 flex items-center gap-2">
             {topStream[0]}
          </div>
          <div className="text-xs text-gray-500 font-medium">₹{(topStream[1]/1000).toFixed(1)}k across platforms</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* 3. Graph */}
        <div className="lg:col-span-2 bg-card border border-border p-5 rounded-xl flex flex-col min-h-[350px]">
           <div className="flex justify-between items-center mb-5">
              <h2 className="font-bold text-base">Revenue Timeline</h2>
              <select className="bg-black/5 dark:bg-white/5 border border-border px-3 py-1.5 rounded-lg text-xs font-semibold focus:outline-none focus:border-primary cursor-pointer appearance-none">
                 <option className="bg-card">This Month</option>
                 <option className="bg-card">Last 3 Months</option>
                 <option className="bg-card">This Year</option>
              </select>
           </div>
           <div className="flex-1 w-full">
              <RevenueLineChart data={lineData} />
           </div>
        </div>

        {/* 2. Platform Breakdown */}
        <div className="bg-card border border-border p-5 rounded-xl flex flex-col min-h-[350px]">
           <h2 className="font-bold text-base mb-4">Income Setup</h2>
           <div className="flex-1 flex flex-col justify-between gap-1">
              {[
                { platform: 'YouTube', icon: <Youtube size={18} strokeWidth={2.5}/>, iconBg: 'bg-red-500/10 text-red-500', type: 'Ad Revenue' },
                { platform: 'Instagram', icon: <Instagram size={18} strokeWidth={2.5}/>, iconBg: 'bg-pink-500/10 text-pink-500', type: 'Sponsorships' },
                { platform: 'Newsletter', icon: <Type size={18} strokeWidth={2.5}/>, iconBg: 'bg-primary/10 text-primary', type: 'Affiliate' },
                { platform: 'Other', icon: <Sparkles size={18} strokeWidth={2.5}/>, iconBg: 'bg-warning-text/10 text-warning-text', type: 'One-offs' },
              ].map(({ platform: p, icon, iconBg, type: pType }) => {
                const platformEntries = ledger.filter(r => r.platform.toLowerCase().includes(p.toLowerCase()) || (p === 'Other' && !['youtube','instagram','newsletter'].some(k => r.platform.toLowerCase().includes(k))));
                const platformTotal = platformEntries.reduce((sum, r) => sum + r.amount, 0);
                const latestEntry = platformEntries[0] || null;
                return (
                  <button
                    key={p}
                    onClick={() => latestEntry && setSelectedLedgerItem(latestEntry)}
                    className="group flex justify-between items-center py-2 px-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-primary/30 w-full text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shadow-inner ${iconBg}`}>{icon}</div>
                      <div>
                        <span className="font-bold text-sm block group-hover:text-primary transition-colors">{p === 'Other' ? 'Other Deals' : p}</span>
                        <span className="text-[10px] text-gray-500 font-semibold">{pType}</span>
                      </div>
                    </div>
                    <div className="text-right">
                       <div className="font-bold text-base tracking-tight group-hover:text-primary transition-colors">
                         {platformTotal > 0 ? `₹${platformTotal.toLocaleString()}` : '—'}
                       </div>
                       <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{platformEntries.length} entries</div>
                    </div>
                  </button>
                );
              })}
           </div>
        </div>
      </div>

      {/* 5. Revenue History Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden mt-6 shadow-sm">
        <div className="p-5 border-b border-border flex justify-between items-center bg-black/[0.02] dark:bg-white/[0.02]">
          <h2 className="font-bold text-base tracking-tight">Ledger History</h2>
          <div className="flex gap-2">
             <button className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-lg text-xs font-bold hover:bg-black/5 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300 transition-colors bg-card"><Filter size={14}/> Filters</button>
          </div>
        </div>
        <div className="overflow-x-auto">
             <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-black/5 dark:bg-black/20">
                    <tr className="text-gray-500 text-[10px] font-bold tracking-widest uppercase border-b border-border">
                        <th className="px-5 py-3">Date</th>
                        <th className="px-5 py-3">Platform</th>
                        <th className="px-5 py-3">Type</th>
                        <th className="px-5 py-3 text-right">Amount</th>
                        <th className="px-5 py-3">Internal Origin</th>
                        <th className="px-5 py-3 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                    {ledger.map((item) => (
                      <tr 
                        key={item.id} 
                        onClick={() => setSelectedLedgerItem(item)}
                        className="hover:bg-black/5 dark:hover:bg-white/[0.04] transition-colors border-b border-border/50 group cursor-pointer"
                      >
                          <td className="px-5 py-4 text-xs font-semibold text-gray-500">{formatDateObj(item.date)}</td>
                          <td className="px-5 py-4 text-black dark:text-white font-bold flex items-center gap-2">
                             <div className={`p-1.5 rounded-lg ${getPlatformIconBg(item.platform)}`}>
                               {getPlatformIcon(item.platform)}
                             </div> 
                             {item.platform}
                          </td>
                          <td className="px-5 py-4"><span className="bg-black/5 dark:bg-white/10 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">{item.type}</span></td>
                          <td className="px-5 py-4 text-success-text font-bold text-right text-base text-gray-800 dark:text-gray-200">₹{item.amount.toLocaleString()}</td>
                          <td className="px-5 py-4">
                             {item.source === 'deal' ? (
                                <span className="flex items-center gap-1.5 text-xs text-primary font-bold bg-primary/10 px-2 py-1 rounded w-fit"><CornerDownRight size={12}/> CRM Link</span>
                             ) : (
                                <span className="flex items-center gap-1.5 text-xs text-gray-500 font-bold bg-gray-500/10 px-2 py-1 rounded w-fit">Manual Log</span>
                             )}
                          </td>
                          <td className="px-5 py-4 text-right" onClick={e => e.stopPropagation()}>
                             <button
                               onClick={() => useStore.getState().deleteRevenue(item.id)}
                               className="p-1.5 text-gray-400 hover:text-danger-text hover:bg-danger-bg/20 rounded-lg transition-colors"
                               title="Delete Revenue Entry"
                             >
                                <Trash2 size={16}/>
                             </button>
                          </td>
                      </tr>
                    ))}
                </tbody>
             </table>
        </div>
      </div>
    </div>
  );
}
