'use client';
import { IndianRupee, Layers, Clock, AlertCircle, AlertTriangle, Zap, User, FileText, Youtube } from 'lucide-react';
import { MonthlyRevenueChart, PlatformDonutChart } from '@/components/Charts';
import { useStore } from '@/src/store';

export default function Dashboard() {
  const revenue = useStore(state => state.revenue);
  const deals = useStore(state => state.deals);
  const payments = useStore(state => state.payments);
  const brands = useStore(state => state.brands);
  const contentTasks = useStore(state => state.contentTasks);

  const currentYear = new Date().getFullYear();

  // Compute Stats
  const totalCollected = revenue.reduce((sum, r) => sum + r.amount, 0);
  const pendingPay = payments.filter(p => p.status === 'Pending').reduce((sum, p) => sum + p.amount, 0);
  const activeDealsCount = deals.filter(d => d.stage !== 'Lost' && !d.isCompleted).length;
  const totalDealsCount = deals.length;
  const overdueCount = payments.filter(p => p.status === 'Overdue').length;

  // Expected vs Actual Cashflow
  const expectedRevenue = deals.filter(d => d.stage !== 'Lost').reduce((sum, d) => sum + d.value, 0);
  const actualRevenue = revenue.filter(r => r.source === 'deal' || !r.source).reduce((sum, r) => sum + r.amount, 0); // Include manual revenues as well
  const revenueGap = expectedRevenue - actualRevenue;

  // Smart Alerts logic
  const pendingDealsCount = payments.filter(p => Boolean(p.status === 'Pending')).length;
  const delayedBrands = brands.filter(b => payments.some(p => p.brand === b.name && p.status === 'Overdue'));

  // What Should I Do Today? (Actionable Items)
  const today = new Date();
  const next48h = new Date(today.getTime() + 48 * 60 * 60 * 1000);
   const actionableItems: { type: string, text: string, icon: React.ReactNode, action: string }[] = [];
  
  payments.filter(p => p.status === 'Overdue').forEach(p => actionableItems.push({ type: 'urgent', text: `Follow up with ${p.brand} for ₹${p.amount.toLocaleString()}`, icon: <AlertCircle size={14} />, action: 'Follow Up' }));
  deals.filter(d => !d.isCompleted && d.stage !== 'Lost' && new Date(d.deadline) <= next48h).forEach(d => actionableItems.push({ type: 'warning', text: `Deliver ${d.deliverable} for ${d.brand}`, icon: <Clock size={14} />, action: 'Deliver' }));
  deals.filter(d => d.stage === 'Delivered').forEach(d => actionableItems.push({ type: 'success', text: `Generate Invoice for ${d.brand}`, icon: <FileText size={14} />, action: 'Invoice' }));
  contentTasks?.filter(t => t.status !== 'Posted' && t.dueDate && new Date(t.dueDate) <= today).forEach(t => actionableItems.push({ type: 'info', text: `Post ${t.title} on ${t.platform}`, icon: <Youtube size={14} />, action: 'Post' }));

  // Monthly Chart Compute
  const monthlyMap: Record<string, number> = {};
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  months.forEach(m => monthlyMap[m] = 0);

  let thisYearCollected = 0;
  revenue.forEach(r => {
     if (r.date.startsWith(currentYear.toString())) {
       thisYearCollected += r.amount;
       const split = r.date.split('-'); 
       if (split.length >= 2) {
         const mIdx = parseInt(split[1], 10) - 1;
         if (!isNaN(mIdx) && mIdx >= 0 && mIdx < 12) {
           monthlyMap[months[mIdx]] += r.amount;
         }
       }
     }
  });

  const barData = months.map(name => ({ name, value: monthlyMap[name] }));

  // YoY calculation string
  const yOy = 'Tracking Live';

  // Platform Donut Compute
  const platformMap: Record<string, number> = {};
  revenue.forEach(r => platformMap[r.platform] = (platformMap[r.platform] || 0) + r.amount);
  const colors = ['#8b5cf6', '#10b981', '#f59e0b', '#3b82f6', '#ec4899'];
  const platformData = Object.keys(platformMap).map((p, i) => ({
    id: i, name: p, revenue: platformMap[p], color: colors[i % colors.length]
  })).sort((a,b) => b.revenue - a.revenue);

  const recentDeals = [...deals]
     .filter(d => !d.isCompleted && d.stage !== 'Lost')
     .sort((a,b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
     .slice(0, 5);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="mb-4">
        <h1 className="text-xl font-bold mb-1">Dashboard</h1>
        <p className="text-foreground-muted text-sm">Welcome back! Here's your business overview.</p>
      </div>

      {/* 1. Smart Alerts */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
         {pendingPay > 0 && (
            <div className="shrink-0 bg-warning-bg/10 border border-warning-text/20 text-warning-text px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
               <Clock size={16} strokeWidth={2.5}/> ₹{pendingPay.toLocaleString()} pending from {pendingDealsCount} deals
            </div>
         )}
         {overdueCount > 0 && (
            <div className="shrink-0 bg-danger-bg/10 border border-danger-text/20 text-danger-text px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 animate-pulse">
               <AlertCircle size={16} strokeWidth={2.5}/> {overdueCount} payments overdue!
            </div>
         )}
         {delayedBrands.map(b => (
            <div key={b.id} className="shrink-0 bg-gray-500/10 border border-border text-gray-500 dark:text-gray-400 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
               <User size={16} strokeWidth={2.5}/> {b.name} delayed 2+ times
            </div>
         ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border p-5 rounded-2xl flex flex-col relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-semibold tracking-wider text-foreground-muted uppercase">TOTAL REVENUE (ALL TIME)</span>
            <div className="p-2 bg-success-bg text-success-text rounded-xl">
              <IndianRupee size={18} />
            </div>
          </div>
          <div className="text-3xl font-bold text-success-text tracking-tight mb-1">₹{totalCollected.toLocaleString()}</div>
          <div className="text-xs text-gray-500 font-medium">₹{thisYearCollected.toLocaleString()} this year</div>
        </div>

        <div className="bg-card border border-border p-5 rounded-2xl flex flex-col relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-semibold tracking-wider text-foreground-muted uppercase">ACTIVE DEALS</span>
            <div className="p-2 bg-primary/20 text-primary rounded-xl">
              <Layers size={18} />
            </div>
          </div>
          <div className="text-3xl font-bold text-primary tracking-tight mb-1">{activeDealsCount}</div>
          <div className="text-xs text-gray-500 font-medium">{totalDealsCount} total lifetime</div>
        </div>

        <div className="bg-card border border-border p-5 rounded-2xl flex flex-col relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-semibold tracking-wider text-foreground-muted uppercase">PENDING PAY</span>
            <div className="p-2 bg-warning-bg bg-opacity-40 text-warning-text rounded-xl">
              <Clock size={18} />
            </div>
          </div>
          <div className="text-3xl font-bold text-warning-text tracking-tight mb-1">₹{pendingPay.toLocaleString()}</div>
          <div className="text-xs text-gray-500 font-medium">Awaiting collection</div>
        </div>

        <div className="bg-card border border-border p-5 rounded-2xl flex flex-col relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-semibold tracking-wider text-foreground-muted uppercase">OVERDUE</span>
            <div className="p-2 bg-danger-bg bg-opacity-40 text-danger-text rounded-xl">
              <AlertCircle size={18} />
            </div>
          </div>
          <div className="text-3xl font-bold text-danger-text tracking-tight mb-1">{overdueCount}</div>
          <div className="text-xs text-gray-500 font-medium">Require attention</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card border border-border p-5 rounded-2xl h-[340px] flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-foreground-muted font-medium text-xs mb-1">Monthly Revenue ({currentYear})</h3>
              <p className="text-2xl font-bold">₹{thisYearCollected.toLocaleString()}</p>
            </div>
            <div className="px-3 py-1 rounded-full bg-success-bg/30 text-success-text border border-success-text/20 text-xs font-bold flex items-center gap-1">
              {yOy}
            </div>
          </div>
          <div className="flex-1 mt-4">
            <MonthlyRevenueChart data={barData} />
          </div>
        </div>
        <div className="bg-card border border-border p-5 rounded-2xl h-[340px] flex flex-col relative">
          <h3 className="text-foreground-muted font-medium text-xs mb-4">Lifetime Platform Revenue</h3>
          <div className="flex-1 mt-0">
            <PlatformDonutChart data={platformData} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col h-[400px]">
          <div className="p-5 border-b border-border">
            <h2 className="text-sm font-bold tracking-wide">Ongoing Deals Timeline</h2>
          </div>
          <div className="p-1 overflow-x-auto flex-1">
             <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                    <tr className="text-foreground-muted text-xs font-semibold tracking-wider">
                        <th className="px-4 py-4 uppercase">Brand</th>
                        <th className="px-4 py-4 uppercase">Platform</th>
                        <th className="px-4 py-4 uppercase">Value</th>
                        <th className="px-4 py-4 uppercase">Status</th>
                        <th className="px-4 py-4 uppercase">Deadline</th>
                    </tr>
                </thead>
                <tbody className="text-foreground font-medium text-sm">
                  {recentDeals.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-foreground-subtle text-xs tracking-widest uppercase">No Active Deals Found</td>
                    </tr>
                  ) : (
                    recentDeals.map(d => (
                    <tr key={d.id} className="hover:bg-foreground/5 transition-colors rounded-lg group">
                        <td className="px-4 py-3 text-foreground group-hover:bg-foreground/5 rounded-l-lg">{d.brand}</td>
                        <td className="px-4 py-3 group-hover:bg-foreground/5">
                          <span className="px-2 py-0.5 rounded-md bg-foreground/5 text-foreground-muted text-xs font-medium border border-border">{d.platform}</span>
                        </td>
                        <td className="px-4 py-3 text-success-text group-hover:bg-foreground/5">₹{d.value.toLocaleString()}</td>
                        <td className="px-4 py-3 group-hover:bg-foreground/5">
                          <span className={`${d.stage === 'Delivered' ? 'text-primary' : d.stage === 'Paid' ? 'text-success-text' : 'text-warning-text'} font-bold`}>{d.stage}</span>
                        </td>
                        <td className="px-4 py-3 text-foreground-muted group-hover:bg-foreground/5 rounded-r-lg">{d.deadline}</td>
                    </tr>
                    ))
                  )}
                </tbody>
             </table>
          </div>
        </div>

        {/* 4. What Should I Do Today? Hook */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col h-[400px] ring-1 ring-primary/20">
           <div className="p-5 border-b border-border bg-gradient-to-r from-primary/10 to-transparent">
             <h2 className="text-sm font-black tracking-wide text-primary flex items-center gap-2"><Zap size={16} fill="currentColor"/> What Should I Do Today?</h2>
           </div>
           <div className="p-4 space-y-3 flex-1 overflow-y-auto">
             {actionableItems.length === 0 ? (
                <div className="text-sm text-foreground-muted font-bold p-6 text-center border-2 border-dashed border-border rounded-xl">You're completely caught up! 🔥</div>
             ) : (
                actionableItems.slice(0, 6).map((item, i) => (
                  <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${item.type === 'urgent' ? 'border-danger-text/20 bg-danger-bg/5 text-danger-text' : item.type === 'warning' ? 'border-warning-text/20 bg-warning-bg/5 text-warning-text' : item.type === 'success' ? 'border-success-text/20 bg-success-text/5 text-success-text' : 'border-border bg-foreground/5 text-foreground'}`}>
                     <div className="shrink-0 mt-0.5">{item.icon}</div>
                     <div className="flex-1">
                        <p className="text-sm font-bold">{item.text}</p>
                     </div>
                      <button className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-foreground/10 hover:bg-foreground/20 transition-colors shrink-0">
                        {item.action}
                      </button>
                  </div>
                ))
             )}
           </div>
        </div>
      </div>
    </div>
  );
}
