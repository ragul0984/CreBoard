'use client';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

export function MonthlyRevenueChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) return <div className="w-full h-full flex items-center justify-center text-sm text-gray-400 font-bold uppercase tracking-widest border-2 border-dashed border-border rounded-xl">No Revenue Data</div>;

  return (
    <div className="w-full h-full min-h-[220px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6b7280', fontSize: 12 }} 
            dy={10}
          />
          <Tooltip 
            cursor={{ fill: 'rgba(128,128,128,0.1)' }}
            contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border-color)', borderRadius: '8px', color: 'var(--fg)' }}
            itemStyle={{ color: 'var(--fg)' }}
            formatter={(value: any) => `₹${Number(value).toLocaleString()}`}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index === data.length - 1 ? '#8b5cf6' : '#6366f1'} opacity={index === data.length - 1 ? 1 : 0.7} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PlatformDonutChart({ data = [] }: { data?: any[] }) {
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  if (data.length === 0) return <div className="w-full h-full flex items-center justify-center text-sm text-gray-400 font-bold uppercase tracking-widest border-2 border-dashed border-border rounded-xl">No Platform Data</div>;

  return (
    <div className="w-full h-full min-h-[200px] flex items-center relative">
      <div className="flex-1 h-full max-w-[45%]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={65}
              paddingAngle={5}
              dataKey="revenue"
              stroke="none"
              isAnimationActive={true}
            >
              {data.map((entry, index) => (
                 <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: any) => `₹${Number(value).toLocaleString()}`}
              contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border-color)', borderRadius: '8px', color: 'var(--fg)', fontSize: '12px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend */}
      <div className="flex-1 flex flex-col gap-3 pl-2 overflow-y-auto max-h-full">
        {data.map((item) => {
          const percentage = totalRevenue > 0 ? (item.revenue / totalRevenue) * 100 : 0;
          return (
            <div key={item.name} className="flex flex-col gap-1 w-full text-sm font-medium">
               <div className="flex justify-between items-center group">
                 <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5 text-xs">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="truncate max-w-[60px]" title={item.name}>{item.name}</span>
                 </span>
                 <div className="flex items-center gap-1.5">
                   <span className="text-black dark:text-white font-bold opacity-80 text-xs">₹{item.revenue >= 1000 ? (item.revenue/1000).toFixed(1) + 'k' : item.revenue}</span>
                   <span className="text-gray-500 text-[10px] w-7 text-right bg-black/5 dark:bg-[#1a1d24] px-1 py-0.5 rounded">{percentage.toFixed(0)}%</span>
                 </div>
               </div>
               <div className="w-full h-1 bg-black/5 dark:bg-white/10 rounded-full mt-0.5 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%`, backgroundColor: item.color }} />
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
