'use client';
import { useMemo, useState } from 'react';
import { useStore } from '@/src/store';
import { TrendingUp, TrendingDown, DollarSign, Clock, AlertCircle, BarChart3, Youtube, Instagram, Briefcase, Zap, ExternalLink, X, ArrowRight, CornerDownRight } from 'lucide-react';
import { RevenueLineChart } from '@/components/revenue/RevenueLineChart';

const formatDateObj = (dateStr: string) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(parts[1], 10)-1]} ${parseInt(parts[2], 10)}, ${parts[0]}`;
};

export default function AnalyticsPage() {
  const deals = useStore(state => state.deals);
  const revenue = useStore(state => state.revenue);
  const payments = useStore(state => state.payments);

  const [selectedInsight, setSelectedInsight] = useState<'revenue' | 'platform' | 'deals' | 'payments' | null>(null);

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;

  const totalThisMonth = revenue.filter(r => {
    const [y, m] = r.date.split('-');
    return parseInt(m, 10) === currentMonth && parseInt(y, 10) === currentYear;
  }).reduce((sum, item) => sum + item.amount, 0);

  const totalLastMonth = revenue.filter(r => {
    const [y, m] = r.date.split('-');
    return parseInt(m, 10) === lastMonth && parseInt(y, 10) === lastMonthYear;
  }).reduce((sum, item) => sum + item.amount, 0);

  const growthObj = totalLastMonth === 0 ? (totalThisMonth > 0 ? 100 : 0) : Math.round(((totalThisMonth - totalLastMonth) / totalLastMonth) * 100);
  const isGrowthPositive = growthObj >= 0;

  const timelineMap: Record<string, number> = {};
  [...revenue].filter(r => {
    const [y, m] = r.date.split('-');
    return parseInt(m, 10) === currentMonth && parseInt(y, 10) === currentYear;
  }).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).forEach(r => {
     const formatted = formatDateObj(r.date).split(',')[0];
     timelineMap[formatted] = (timelineMap[formatted] || 0) + r.amount;
  });
  const lineData = Object.keys(timelineMap).map(k => ({ date: k, amount: timelineMap[k] }));

  // 2. PLATFORM PERFORMANCE 
  const platformData = revenue.reduce((acc, r) => {
     if (r.amount > 0) {
        acc[r.platform] = (acc[r.platform] || 0) + r.amount;
     }
     return acc;
  }, {} as Record<string, number>);
  const bestPlatform = Object.entries(platformData).length > 0 
    ? Object.entries(platformData).reduce((a, b) => a[1] > b[1] ? a : b, ['None', 0])[0] 
    : 'None';

  // 3. DEAL PERFORMANCE
  const avgDealValue = deals.length ? deals.reduce((sum, d) => sum + d.value, 0) / deals.length : 0;
  
  const brandData = deals.reduce((acc, d) => {
     acc[d.brand] = (acc[d.brand] || 0) + d.value;
     return acc;
  }, {} as Record<string, number>);
  const topBrand = Object.entries(brandData).length > 0 
    ? Object.entries(brandData).reduce((a, b) => a[1] > b[1] ? a : b, ['None', 0])[0] 
    : 'None';

  // 4. PAYMENT INSIGHTS
  const pendingMoney = payments.filter(p => p.status === 'Pending').reduce((sum, p) => sum + p.amount, 0);
  const overdueMoney = payments.filter(p => p.status === 'Overdue').reduce((sum, p) => sum + p.amount, 0);

  // Modal Render Logic
  const renderInsightModal = () => {
    if (!selectedInsight) return null;

    let title = '';
    let content = null;

    if (selectedInsight === 'revenue') {
       title = 'Recent Revenue Summary';
       content = (
          <div className="space-y-3">
             <div className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest mb-4">Last 5 Transactions</div>
             {revenue.slice(0,5).map(r => (
                <div key={r.id} className="flex justify-between items-center p-4 border border-border rounded-xl bg-foreground/[0.02]">
                   <div>
                      <div className="font-bold text-sm text-foreground">{r.platform}</div>
                      <div className="text-[10px] text-foreground-muted font-bold flex items-center gap-1"><CornerDownRight size={10}/> {r.type}</div>
                   </div>
                   <div className="text-right">
                      <span className="text-base text-success-text font-black">₹{r.amount.toLocaleString()}</span>
                      <div className="text-[10px] text-foreground-subtle font-bold">{formatDateObj(r.date)}</div>
                   </div>
                </div>
             ))}
             {revenue.length === 0 && <div className="text-foreground-muted text-sm p-4 text-center border border-dashed rounded-xl font-medium">No revenue recorded yet.</div>}
          </div>
       );
    } else if (selectedInsight === 'deals') {
       title = 'Active Deals Board';
       content = (
          <div className="space-y-3">
             <div className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest mb-4">Currently Open Deals</div>
             {deals.filter(d => !d.isCompleted && d.stage !== 'Lost').map(d => (
                <div key={d.id} className="flex justify-between items-center p-4 border border-border rounded-xl bg-foreground/[0.02]">
                   <div>
                      <div className="font-bold text-sm text-foreground">{d.brand}</div>
                      <div className="text-[10px] text-primary font-black bg-primary/10 px-2 py-0.5 rounded w-fit mt-1 border border-primary/20 uppercase tracking-wider">{d.stage}</div>
                   </div>
                   <span className="font-black text-base text-foreground">₹{d.value.toLocaleString()}</span>
                </div>
             ))}
             {deals.filter(d => !d.isCompleted && d.stage !== 'Lost').length === 0 && <div className="text-foreground-muted text-sm text-center p-4 font-medium">No active deals found.</div>}
          </div>
       );
    } else if (selectedInsight === 'payments') {
       title = 'Outstanding Payments';
       content = (
          <div className="space-y-3">
             <div className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest mb-4">Pending & Overdue</div>
             {payments.filter(p => p.status !== 'Paid').map(p => (
                <div key={p.id} className="flex justify-between items-center p-4 border border-border rounded-xl bg-foreground/[0.02]">
                   <div>
                      <div className="font-bold text-sm text-foreground">{p.brand}</div>
                      <div className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded w-fit mt-1 ${p.status === 'Overdue' ? 'bg-danger-bg text-danger-text border border-danger-text/20' : 'bg-warning-bg text-warning-text border border-warning-text/20'}`}>{p.status}</div>
                   </div>
                   <div className="text-right">
                     <span className={`font-black text-base tracking-tight ${p.status === 'Overdue' ? 'text-danger-text' : 'text-warning-text'}`}>₹{p.amount.toLocaleString()}</span>
                     <div className="text-[10px] font-bold text-foreground-muted">Due: {formatDateObj(p.dueDate)}</div>
                   </div>
                </div>
             ))}
             {payments.filter(p => p.status !== 'Paid').length === 0 && <div className="text-foreground-muted text-sm text-center p-4 font-medium font-bold uppercase tracking-widest">All invoices settled!</div>}
          </div>
       )
    } else if (selectedInsight === 'platform') {
       title = 'Platform Yield Output';
       content = (
          <div className="space-y-3">
             <div className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest mb-4">Total Generated Matrix</div>
             {Object.entries(platformData).sort((a,b)=>b[1]-a[1]).map(([plat, val], idx) => (
                <div key={plat} className="flex justify-between items-center p-4 border border-border rounded-xl bg-foreground/[0.02]">
                   <div className="font-bold text-sm flex items-center gap-2 text-foreground">
                       <span className="text-foreground-subtle text-[10px] font-black">0{idx + 1}</span> {plat}
                   </div>
                   <span className="font-black text-base text-foreground tracking-tight">₹{val.toLocaleString()}</span>
                </div>
             ))}
          </div>
       )
    }

    return (
       <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setSelectedInsight(null)}>
          <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl border border-border overflow-hidden" onClick={e => e.stopPropagation()}>
             <div className="p-5 border-b border-border flex justify-between items-center bg-foreground/5">
                <h2 className="font-black text-lg text-foreground">{title}</h2>
                <button onClick={() => setSelectedInsight(null)} className="p-1.5 rounded-lg text-foreground-muted hover:text-foreground bg-foreground/5 transition-colors"><X size={16} strokeWidth={3}/></button>
             </div>
             <div className="p-6 max-h-[60vh] overflow-y-auto">
                {content}
             </div>
             <div className="p-4 bg-foreground/[0.02] border-t border-border flex justify-center">
                <button onClick={() => setSelectedInsight(null)} className="text-xs font-black text-primary hover:underline flex items-center gap-1 uppercase tracking-widest">Close Summary <ArrowRight size={14}/></button>
             </div>
          </div>
       </div>
    );
 }

  return (
    <div className="p-5 max-w-[1400px] mx-auto space-y-6 bg-[var(--color-background)] min-h-screen pb-12">
       
       {renderInsightModal()}

       <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-2xl font-black mb-1 flex items-center gap-2 text-foreground"><BarChart3 size={24} className="text-primary"/> Analytics Engine</h1>
            <p className="text-foreground-muted text-sm font-bold">Business intelligence measuring your macro performance.</p>
          </div>
       </div>

       {/* 1. TOP METRICS: Growth Overview (Clickable tile Pop-ups) */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div onClick={() => setSelectedInsight('revenue')} className="cursor-pointer bg-card border border-border p-5 rounded-xl shadow-sm hover:border-primary/50 hover:bg-foreground/[0.02] transition-colors group block relative overflow-hidden">
            <span className="text-[10px] font-black text-foreground-muted uppercase tracking-widest block mb-1 relative z-10 group-hover:text-primary transition-colors flex justify-between">This Month <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity -mt-0.5"/></span>
            <div className="text-3xl font-black tracking-tighter text-foreground group-hover:text-success-text transition-colors">₹{totalThisMonth.toLocaleString()}</div>
          </div>
          <div onClick={() => setSelectedInsight('revenue')} className="cursor-pointer bg-card border border-border p-5 rounded-xl shadow-sm hover:border-primary/50 hover:bg-foreground/[0.02] transition-colors group block relative overflow-hidden">
            <span className="text-[10px] font-black text-foreground-muted uppercase tracking-widest block mb-1 flex justify-between group-hover:text-primary transition-colors">Last Month <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity -mt-0.5"/></span>
            <div className="text-3xl font-black text-foreground tracking-tighter group-hover:text-primary transition-colors">₹{totalLastMonth.toLocaleString()}</div>
          </div>
          <div onClick={() => setSelectedInsight('revenue')} className="cursor-pointer bg-card border border-border p-5 rounded-xl shadow-sm relative overflow-hidden hover:border-primary/50 hover:bg-foreground/[0.02] transition-colors group block">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-primary/10 transition-colors"></div>
            <span className="text-[10px] font-black text-foreground-muted uppercase tracking-widest block mb-1 group-hover:text-primary transition-colors flex justify-between relative z-10">MoM Growth <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity -mt-0.5"/></span>
            <div className={`text-3xl font-black tracking-tighter flex items-center gap-2 relative z-10 ${isGrowthPositive ? 'text-success-text' : 'text-danger-text'}`}>
              {isGrowthPositive ? <TrendingUp size={24} strokeWidth={3}/> : <TrendingDown size={24} strokeWidth={3}/>} {Math.abs(growthObj)}%
            </div>
          </div>
          <div onClick={() => setSelectedInsight('platform')} className="cursor-pointer bg-card border border-border p-5 rounded-xl shadow-sm hover:border-primary/50 hover:bg-foreground/[0.02] transition-colors group block">
            <span className="text-[10px] font-black text-foreground-muted uppercase tracking-widest block mb-1 group-hover:text-primary transition-colors flex justify-between">Best Platform <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity -mt-0.5"/></span>
            <div className="text-3xl font-black text-primary tracking-tighter truncate">{bestPlatform}</div>
          </div>
       </div>
       
       {/* 6. SMART INSIGHTS TEXT HIGHLIGHTS */}
       <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 flex flex-col gap-3 shadow-[0_0_20px_rgba(var(--color-primary),0.03)] mt-2">
          <h3 className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2"><Zap size={14}/> Smart Insights</h3>
          <ul className="space-y-2 text-sm font-bold text-foreground leading-relaxed">
             {growthObj > 0 ? (
                <li className="flex items-start gap-2"><span className="text-success-text font-black mt-0.5">•</span> You earned <strong className="text-success-text font-black">{growthObj}% more</strong> than last month. This aggressive board momentum is driven directly by {topBrand}.</li>
             ) : growthObj < 0 ? (
                <li className="flex items-start gap-2"><span className="text-danger-text font-black mt-0.5">•</span> Revenue decreased <strong className="text-danger-text font-black">{Math.abs(growthObj)}%</strong> compared to last month. Consider ramping up lead generation.</li>
             ) : (
                <li className="flex items-start gap-2"><span className="text-foreground-muted font-black mt-0.5">•</span> Revenue is exactly flat compared to last month.</li>
             )}
             
             {topBrand !== 'None' && (
               <li className="flex items-start gap-2 leading-relaxed"><span className="text-primary font-black mt-0.5">•</span> {topBrand} is currently your most lucrative relationship producing ₹{brandData[topBrand]?.toLocaleString()} in board value.</li>
             )}
             {overdueMoney > 0 && <li className="flex items-start gap-2 leading-relaxed"><span className="text-danger-text font-black mt-0.5">•</span> <strong>Warning:</strong> You have <strong className="text-danger-text">₹{overdueMoney.toLocaleString()} in severely overdue</strong> payments dragging down your cashflow. Follow up immediately.</li>}
             {overdueMoney === 0 && <li className="flex items-start gap-2 leading-relaxed"><span className="text-success-text font-black mt-0.5">•</span> <strong>Zero Overdue Cash.</strong> Your invoice collections process is currently flawless.</li>}
          </ul>
       </div>

       {/* Top Row Grid: Charts + Breakdowns */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
           
           {/* 2. REVENUE TREND CHART */}
           <div className="col-span-2 bg-card border border-border rounded-xl p-6 min-h-[350px] flex flex-col shadow-sm">
              <div className="flex justify-between items-center mb-5">
                 <h2 className="font-black text-[10px] uppercase tracking-widest text-foreground-muted">Revenue Trend</h2>
                 <select className="bg-foreground/5 border border-border px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider focus:outline-none focus:border-primary cursor-pointer appearance-none text-foreground">
                    <option className="bg-card">Daily</option>
                    <option className="bg-card">Weekly</option>
                    <option className="bg-card">Monthly</option>
                 </select>
              </div>
              <div className="flex-1 w-full -ml-4">
                 <RevenueLineChart data={lineData} />
              </div>
           </div>
           
           {/* 3. PLATFORM BREAKDOWN (Clickable summary popup) */}
           <div className="bg-card border border-border rounded-xl p-6 flex flex-col shadow-sm">
               <h2 className="font-black text-[10px] uppercase tracking-widest text-foreground-muted mb-5">Platform Breakdown</h2>
               <div className="space-y-3">
                  {Object.entries(platformData).sort((a,b)=>b[1]-a[1]).map(([plat, val], idx) => (
                     <div key={plat} onClick={() => setSelectedInsight('platform')} className="cursor-pointer flex justify-between items-center p-3.5 rounded-xl border border-border hover:border-primary/50 transition-colors bg-card shadow-sm hover:shadow-md group w-full relative overflow-hidden">
                        <div className="flex justify-between w-full relative z-10">
                            <div className="font-black text-sm text-foreground flex items-center gap-2 group-hover:text-primary transition-colors">
                                <span className="text-[10px] font-black text-foreground-subtle group-hover:text-primary transition-colors">0{idx + 1}</span> 
                                {plat} <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity ml-1"/>
                            </div>
                            <div className="text-right">
                               <div className="font-black text-[15px] tracking-tight text-foreground group-hover:text-primary transition-colors">₹{val.toLocaleString()}</div>
                               <div className="text-[10px] text-primary font-black uppercase tracking-widest">{((val / totalThisMonth) * 100).toFixed(0)}% contribution</div>
                            </div>
                        </div>
                     </div>
                  ))}
                  {Object.keys(platformData).length === 0 && (
                     <div className="text-center p-4 text-[10px] font-black text-foreground-muted border border-dashed border-border rounded-xl uppercase tracking-widest">
                        No platform streams found yet.
                     </div>
                  )}
               </div>
           </div>
       </div>

       {/* Bottom Row Grid: Deals vs Payments insights */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* 4. DEAL PERFORMANCE (Clickable -> summary) */}
          <div onClick={() => setSelectedInsight('deals')} className="cursor-pointer bg-card border border-border p-6 shadow-sm hover:border-primary/50 hover:bg-foreground/[0.01] transition-colors group block relative rounded-xl">
             <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-primary/10 text-primary p-1.5 rounded-md"><ExternalLink size={16}/></div>
             <h2 className="font-black text-[10px] uppercase tracking-widest text-foreground-muted mb-5 flex items-center gap-2 group-hover:text-primary transition-colors"><Briefcase size={16}/> Deal Analysis</h2>
             
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-foreground/5 border border-border p-5 rounded-xl">
                    <span className="text-[10px] font-black text-foreground-muted uppercase tracking-widest block mb-1.5 flex items-center justify-between">
                       Avg Deal Value <TrendingUp size={12} className="text-success-text"/>
                    </span>
                    <div className="text-2xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors">₹{Math.round(avgDealValue).toLocaleString()}</div>
                </div>
                <div className="bg-foreground/5 border border-border p-5 rounded-xl">
                    <span className="text-[10px] font-black text-foreground-muted uppercase tracking-widest block mb-1.5">Total Deals</span>
                    <div className="text-2xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors">{deals.length}</div>
                </div>
                <div className="col-span-2 bg-primary/10 border border-primary/20 p-5 rounded-xl flex justify-between items-center shadow-inner group-hover:bg-primary/20 transition-colors">
                    <div>
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest block mb-1">Top Paying Brand</span>
                        <div className="text-xl font-black text-primary tracking-tight">{topBrand}</div>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] font-black text-primary/70 uppercase tracking-widest block mb-1">Total Board Output</span>
                        <div className="text-lg font-black text-primary">₹{brandData[topBrand]?.toLocaleString() || 0}</div>
                    </div>
                </div>
             </div>
          </div>

          {/* 5. PAYMENT INSIGHTS (Clickable -> summary) */}
          <div onClick={() => setSelectedInsight('payments')} className="cursor-pointer bg-card border border-border rounded-xl p-6 shadow-sm hover:border-primary/50 hover:bg-foreground/[0.01] transition-colors group block relative">
             <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-primary/10 text-primary p-1.5 rounded-md"><ExternalLink size={16}/></div>
             <h2 className="font-black text-[10px] uppercase tracking-widest text-foreground-muted mb-5 flex items-center gap-2 group-hover:text-success-text transition-colors"><DollarSign size={16}/> Payment Health</h2>
             
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-warning-text/10 border border-warning-text/20 p-5 rounded-xl shadow-inner group-hover:bg-warning-text/20 transition-colors">
                    <span className="text-[10px] font-black text-warning-text uppercase tracking-widest block mb-1.5 flex items-center gap-1"><Clock size={12}/> Pending Cash</span>
                    <div className="text-2xl font-black tracking-tight text-warning-text">₹{pendingMoney.toLocaleString()}</div>
                </div>
                <div className={`border p-5 rounded-xl shadow-inner transition-colors ${overdueMoney > 0 ? 'bg-danger-text/10 border-danger-text/20 group-hover:bg-danger-text/20' : 'bg-foreground/5 border-border'}`}>
                    <span className={`text-[10px] font-black uppercase tracking-widest block mb-1.5 flex items-center gap-1 ${overdueMoney > 0 ? 'text-danger-text' : 'text-foreground-muted'}`}>
                       <AlertCircle size={12}/> Overdue Cash
                    </span>
                    <div className={`text-2xl font-black tracking-tight ${overdueMoney > 0 ? 'text-danger-text' : 'text-foreground'}`}>₹{overdueMoney.toLocaleString()}</div>
                </div>
                <div className="col-span-2 bg-foreground/5 border border-border p-5 rounded-xl flex justify-between items-center group-hover:border-primary/50 transition-colors">
                    <div>
                        <span className="text-[10px] font-black text-foreground-muted uppercase tracking-widest block mb-1">Avg Payment Delay</span>
                        <div className="text-xl font-black tracking-tight text-foreground">14 Days</div>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] font-black text-foreground-muted uppercase tracking-widest block mb-1">Health Metric</span>
                        <div className="text-xs font-black text-foreground-subtle border border-border bg-card px-2.5 py-1 rounded-md uppercase tracking-wider">Industry Standard</div>
                    </div>
                </div>
             </div>
          </div>
       </div>

    </div>
  )
}
