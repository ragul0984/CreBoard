'use client';
import { IndianRupee, Layers, Clock, AlertCircle } from 'lucide-react';
import { MonthlyRevenueChart, PlatformDonutChart } from '../components/Charts';
import { useStore } from '../src/store';

export default function Dashboard() {
  const revenue = useStore(state => state.revenue);
  const deals = useStore(state => state.deals);
  const payments = useStore(state => state.payments);

  const currentYear = new Date().getFullYear();

  // Compute Stats
  const totalCollected = revenue.reduce((sum, r) => sum + r.amount, 0);
  const pendingPay = payments.filter(p => p.status === 'Pending').reduce((sum, p) => sum + p.amount, 0);
  const activeDealsCount = deals.filter(d => d.stage !== 'Lost' && !d.isCompleted).length;
  const totalDealsCount = deals.length;
  const overdueCount = payments.filter(p => p.status === 'Overdue').length;

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
        <p className="text-gray-500 text-sm dark:text-gray-400">Welcome back! Here's your business overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border p-5 rounded-2xl flex flex-col relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-semibold tracking-wider text-gray-500">TOTAL REVENUE (ALL TIME)</span>
            <div className="p-2 bg-success-bg text-success-text rounded-xl">
              <IndianRupee size={18} />
            </div>
          </div>
          <div className="text-3xl font-bold text-success-text tracking-tight mb-1">₹{totalCollected.toLocaleString()}</div>
          <div className="text-xs text-gray-500 font-medium">₹{thisYearCollected.toLocaleString()} this year</div>
        </div>

        <div className="bg-card border border-border p-5 rounded-2xl flex flex-col relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-semibold tracking-wider text-gray-500">ACTIVE DEALS</span>
            <div className="p-2 bg-primary/20 text-primary rounded-xl">
              <Layers size={18} />
            </div>
          </div>
          <div className="text-3xl font-bold text-primary tracking-tight mb-1">{activeDealsCount}</div>
          <div className="text-xs text-gray-500 font-medium">{totalDealsCount} total lifetime</div>
        </div>

        <div className="bg-card border border-border p-5 rounded-2xl flex flex-col relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-semibold tracking-wider text-gray-500">PENDING PAY</span>
            <div className="p-2 bg-warning-bg bg-opacity-40 text-warning-text rounded-xl">
              <Clock size={18} />
            </div>
          </div>
          <div className="text-3xl font-bold text-warning-text tracking-tight mb-1">₹{pendingPay.toLocaleString()}</div>
          <div className="text-xs text-gray-500 font-medium">Awaiting collection</div>
        </div>

        <div className="bg-card border border-border p-5 rounded-2xl flex flex-col relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-semibold tracking-wider text-gray-500">OVERDUE</span>
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
              <h3 className="text-gray-500 dark:text-gray-400 font-medium text-xs mb-1">Monthly Revenue ({currentYear})</h3>
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
          <h3 className="text-gray-500 dark:text-gray-400 font-medium text-xs mb-4">Lifetime Platform Revenue</h3>
          <div className="flex-1 mt-0">
            <PlatformDonutChart data={platformData} />
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden mt-6">
        <div className="p-5 border-b border-border">
          <h2 className="text-sm font-bold tracking-wide">Ongoing Deals Timeline</h2>
        </div>
        <div className="p-1 overflow-x-auto">
             <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                    <tr className="text-gray-500 text-xs font-semibold tracking-wider">
                        <th className="px-4 py-4 uppercase">Brand</th>
                        <th className="px-4 py-4 uppercase">Platform</th>
                        <th className="px-4 py-4 uppercase">Value</th>
                        <th className="px-4 py-4 uppercase">Status</th>
                        <th className="px-4 py-4 uppercase">Deadline</th>
                    </tr>
                </thead>
                <tbody className="text-gray-700 dark:text-gray-300 font-medium text-sm">
                  {recentDeals.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-gray-400 text-xs tracking-widest uppercase">No Active Deals Found</td>
                    </tr>
                  ) : (
                    recentDeals.map(d => (
                    <tr key={d.id} className="hover:bg-black/5 dark:hover:bg-white/[0.02] transition-colors rounded-lg group">
                        <td className="px-4 py-3 text-black dark:text-white group-hover:bg-black/5 dark:group-hover:bg-white/[0.02] rounded-l-lg">{d.brand}</td>
                        <td className="px-4 py-3 group-hover:bg-black/5 dark:group-hover:bg-white/[0.02]">
                          <span className="px-2 py-0.5 rounded-md bg-black/5 dark:bg-[#1b1e27] text-gray-500 dark:text-gray-400 text-xs font-medium border border-border">{d.platform}</span>
                        </td>
                        <td className="px-4 py-3 text-success-text group-hover:bg-black/5 dark:group-hover:bg-white/[0.02]">₹{d.value.toLocaleString()}</td>
                        <td className="px-4 py-3 group-hover:bg-black/5 dark:group-hover:bg-white/[0.02]">
                          <span className={`${d.stage === 'Delivered' ? 'text-primary' : d.stage === 'Paid' ? 'text-success-text' : 'text-warning-text'} font-bold`}>{d.stage}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 group-hover:bg-black/5 dark:group-hover:bg-white/[0.02] rounded-r-lg">{d.deadline}</td>
                    </tr>
                    ))
                  )}
                </tbody>
             </table>
        </div>
      </div>
    </div>
  );
}
