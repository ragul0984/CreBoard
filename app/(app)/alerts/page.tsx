'use client';
import { useStore } from '@/src/store';
import { AlertCircle, Clock, AlertTriangle, Zap, Youtube, FileText, CheckCircle2, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function AlertsPage() {
  const deals = useStore(state => state.deals);
  const payments = useStore(state => state.payments);
  const contentTasks = useStore(state => state.contentTasks);

  const today = new Date();
  const next48h = new Date(today.getTime() + 48 * 60 * 60 * 1000);

  const alerts: { type: 'urgent' | 'warning' | 'info' | 'success', title: string, description: string, icon: any, action: string, link: string }[] = [];

  // 1. Overdue Payments
  payments.filter(p => p.status === 'Overdue').forEach(p => {
    alerts.push({
      type: 'urgent',
      title: 'Overdue Payment',
      description: `₹${p.amount.toLocaleString()} from ${p.brand} is overdue.`,
      icon: AlertCircle,
      action: 'Collect',
      link: '/payments'
    });
  });

  // 2. Due Soon Deliverables
  deals.filter(d => !d.isCompleted && d.stage !== 'Lost' && new Date(d.deadline) <= next48h).forEach(d => {
    alerts.push({
      type: 'warning',
      title: 'Deadline Approaching',
      description: `Deliverable for ${d.brand} is due on ${d.deadline}.`,
      icon: Clock,
      action: 'View Deal',
      link: '/deals'
    });
  });

  // 3. Waiting Invoices
  deals.filter(d => d.stage === 'Delivered').forEach(d => {
    alerts.push({
      type: 'info',
      title: 'Pending Invoice',
      description: `${d.brand} deal marked as Delivered. Time to invoice!`,
      icon: FileText,
      action: 'Go to Payments',
      link: '/payments'
    });
  });

  // 4. Overdue Content Tasks
  contentTasks?.filter(t => t.status !== 'Posted' && t.dueDate && new Date(t.dueDate) <= today).forEach(t => {
    alerts.push({
      type: 'urgent',
      title: 'Missed Publication',
      description: `"${t.title}" was scheduled for ${t.dueDate}.`,
      icon: Youtube,
      action: 'Planner',
      link: '/planner'
    });
  });

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Smart Alerts Center</h1>
          <p className="text-sm text-foreground-muted">Critical insights requiring your immediate attention.</p>
        </div>
        <div className="text-xs font-black text-foreground-subtle uppercase tracking-widest bg-foreground/5 px-3 py-1 rounded-full">
           {alerts.length} Active Items
        </div>
      </div>

      <div className="space-y-4">
        {alerts.length === 0 ? (
          <div className="bg-card border-2 border-dashed border-border p-20 rounded-3xl text-center">
             <div className="w-16 h-16 bg-success-text/10 text-success-text rounded-3xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={32} />
             </div>
             <h2 className="text-xl font-black text-foreground mb-2">You're All Clear</h2>
             <p className="text-sm text-foreground-muted">Everything is on track! Check back later for smart insights.</p>
          </div>
        ) : (
          alerts.sort((a,b) => {
            const urgency = { urgent: 0, warning: 1, info: 2, success: 3 };
            return urgency[a.type] - urgency[b.type];
          }).map((alert, idx) => (
            <div 
              key={idx}
              className={`bg-card border p-5 rounded-3xl flex items-start gap-4 group transition-all hover:scale-[1.01] ${
                alert.type === 'urgent' ? 'border-danger-text/20 shadow-lg shadow-danger-text/5' :
                alert.type === 'warning' ? 'border-warning-text/20' :
                'border-border'
              }`}
            >
              <div className={`p-3 rounded-2xl shrink-0 ${
                alert.type === 'urgent' ? 'bg-danger-bg/10 text-danger-text' :
                alert.type === 'warning' ? 'bg-warning-bg/10 text-warning-text' :
                'bg-foreground/5 text-foreground-muted'
              }`}>
                <alert.icon size={20} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-black text-base text-foreground">{alert.title}</h3>
                  <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-1.5 py-0.5 rounded ${
                    alert.type === 'urgent' ? 'bg-danger-text text-white' :
                    alert.type === 'warning' ? 'bg-warning-text text-white' :
                    'bg-foreground/10 text-foreground-muted'
                  }`}>
                    {alert.type}
                  </span>
                </div>
                <p className="text-sm text-foreground-muted mb-4">{alert.description}</p>
                
                <Link 
                  href={alert.link}
                  className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-primary hover:gap-3 transition-all"
                >
                  {alert.action} <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Action Hook */}
      <div className="bg-primary/5 border border-primary/20 p-6 rounded-3xl">
         <h4 className="text-sm font-black text-primary uppercase tracking-[0.1em] mb-4 flex items-center gap-2">
            <Zap size={16} fill="currentColor"/> Pro-Tip
         </h4>
         <p className="text-sm text-foreground font-medium leading-relaxed">
           Stay on top of your brand relationships by resolving **Urgent** alerts within 24 hours. Consistent follow-ups can increase your payment turnaround time by up to 40%.
         </p>
      </div>
    </div>
  );
}
