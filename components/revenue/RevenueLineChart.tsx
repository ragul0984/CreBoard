'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function RevenueLineChart({ data = [] }: { data?: any[] }) {
  if (!data || data.length === 0) return <div className="w-full h-full min-h-[300px] flex justify-center items-center text-gray-500 text-sm font-bold uppercase tracking-widest border-2 border-dashed border-border rounded-xl">No Timeline Data</div>;

  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.5} />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }} 
            dy={10}
            minTickGap={20}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }}
            tickFormatter={(value) => `₹${value >= 1000 ? (value/1000)+'k' : value}`}
            dx={-10}
          />
          <Tooltip 
            cursor={{ stroke: 'var(--border-color)', strokeWidth: 1, strokeDasharray: '5 5' }}
            contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border-color)', borderRadius: '12px', color: 'var(--fg)', fontSize: '13px', fontWeight: 600, padding: '12px' }}
            formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
            labelStyle={{ color: '#6b7280', marginBottom: '8px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
          />
          <Line 
            type="monotone" 
            dataKey="amount" 
            stroke="var(--color-primary)" 
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2, fill: 'var(--card)', stroke: 'var(--color-primary)' }}
            activeDot={{ r: 6, fill: 'var(--color-primary)', stroke: 'var(--card)', strokeWidth: 3 }}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
