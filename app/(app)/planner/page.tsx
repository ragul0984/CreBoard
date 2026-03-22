'use client';
import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, CheckCircle2, AlertCircle, Plus, Youtube, Instagram, Briefcase, ChevronLeft, ChevronRight, FileText, Type, LayoutTemplate, X } from 'lucide-react';
import { useStore, ContentTask } from '@/src/store';

const getPlatformIcon = (platform: string) => {
   const p = platform.toLowerCase();
   if (p.includes('youtube')) return <Youtube size={14} className="text-red-500"/>;
   if (p.includes('instagram')) return <Instagram size={14} className="text-pink-500"/>;
   return <Type size={14} className="text-blue-500"/>;
};

export default function PlannerPage() {
  const deals = useStore(state => state.deals);
  const payments = useStore(state => state.payments);
  const contentTasks = useStore(state => state.contentTasks);
  const addContentTask = useStore(state => state.addContentTask);
  const updateContentTaskStatus = useStore(state => state.updateContentTaskStatus);

  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [selectedCalendarItem, setSelectedCalendarItem] = useState<any>(null);
  
  // Quick Add Form State
  const [qTitle, setQTitle] = useState('');
  const [qPlatform, setQPlatform] = useState('Instagram');
  const [qType, setQType] = useState('Reel');
  const [qDate, setQDate] = useState(new Date().toISOString().split('T')[0]);

  const handleQuickAdd = (e: any) => {
     e.preventDefault();
     if (!qTitle) return;
     addContentTask({
        id: Math.random().toString(36).substring(7),
        title: qTitle,
        platform: qPlatform,
        type: qType,
        status: 'Idea',
        dueDate: qDate
     });
     setQTitle('');
     setIsQuickAddOpen(false);
  };

  const todayStr = new Date().toISOString().split('T')[0];

  // AI-Aggregated Today View Array
  const todaysTasks = contentTasks.filter(t => t.dueDate === todayStr && t.status !== 'Posted');
  const todaysDeals = deals.filter(d => !d.isCompleted && d.deadline === todayStr);
  const todaysPayments = payments.filter(p => p.status !== 'Paid' && p.dueDate === todayStr);
  const overduePayments = payments.filter(p => p.status === 'Overdue');

  // Simple visual calendar mock for the current week slice
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const renderCalendarModal = () => {
    if (!selectedCalendarItem) return null;

    return (
       <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setSelectedCalendarItem(null)}>
          <div className="bg-card w-full max-w-sm rounded-2xl shadow-2xl border border-border overflow-hidden" onClick={e => e.stopPropagation()}>
             <div className="p-4 border-b border-border flex justify-between items-center bg-black/10 dark:bg-white/5">
                <h2 className="font-bold text-[10px] uppercase tracking-widest text-foreground-muted">
                   {selectedCalendarItem.type === 'content' ? 'Content Execution Task' : selectedCalendarItem.type === 'deal' ? 'CRM Deadline Linked' : 'Action Required Alert'}
                </h2>
                <button onClick={() => setSelectedCalendarItem(null)} className="p-1 rounded-lg text-gray-500 hover:text-black dark:hover:text-white bg-black/5 dark:bg-white/5 transition-colors"><X size={16} strokeWidth={3}/></button>
             </div>
             <div className="p-6">
                {selectedCalendarItem.type === 'content' && (
                   <div className="space-y-4 text-center">
                      <div className="flex justify-center mb-2"><div className="p-3 rounded-full bg-primary/10 text-primary"><CalendarIcon size={24}/></div></div>
                      <h3 className="font-black text-xl text-gray-800 dark:text-gray-200 leading-tight">{selectedCalendarItem.data.title}</h3>
                      <div className="flex justify-center items-center gap-2">
                         <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">{selectedCalendarItem.data.platform}</span>
                         <span className="text-xs font-bold text-foreground-muted bg-black/5 dark:bg-white/5 px-2 py-1 rounded border border-border">{selectedCalendarItem.data.type} Format</span>
                      </div>
                      <p className="text-sm font-medium text-gray-500 mt-2">Target Date: <span className="text-gray-800 dark:text-gray-200 font-bold">{selectedCalendarItem.data.dueDate}</span></p>
                      <button onClick={() => { updateContentTaskStatus(selectedCalendarItem.data.id, 'Posted'); setSelectedCalendarItem(null); }} className="w-full mt-2 py-2 rounded-xl bg-primary text-white font-bold text-sm shadow-sm hover:bg-primary-hover transition-colors">Mark as Posted!</button>
                   </div>
                )}
                {selectedCalendarItem.type === 'deal' && (
                   <div className="space-y-4 text-center">
                      <div className="flex justify-center mb-2"><div className="p-3 rounded-full bg-warning-text/10 text-warning-text"><Briefcase size={24}/></div></div>
                      <h3 className="font-black text-xl text-gray-800 dark:text-gray-200 leading-tight">{selectedCalendarItem.data.brand} Deliverables</h3>
                      <div className="text-3xl font-black text-success-text tracking-tight">₹{selectedCalendarItem.data.value.toLocaleString()}</div>
                      <div className="text-xs font-bold text-warning-text bg-warning-text/10 px-3 py-1.5 rounded-md inline-block border border-warning-text/20">Deal Stage: {selectedCalendarItem.data.stage}</div>
                      <p className="text-sm font-medium text-gray-500 mt-2">The deadline for this contract is completely active in your CRM right now.</p>
                   </div>
                )}
                {selectedCalendarItem.type === 'payment' && (
                   <div className="space-y-4 text-center">
                      <div className="flex justify-center mb-2"><div className="p-3 rounded-full bg-danger-text/10 text-danger-text"><AlertCircle size={24}/></div></div>
                      <h3 className="font-black text-xl text-gray-800 dark:text-gray-200 leading-tight">{selectedCalendarItem.data.brand} Invoice</h3>
                      <div className="text-3xl font-black text-danger-text tracking-tight">₹{selectedCalendarItem.data.amount.toLocaleString()}</div>
                      <div className="text-xs font-bold text-danger-text bg-danger-text/10 px-3 py-1.5 rounded-md inline-block border border-danger-text/20">Severely Overdue</div>
                      <p className="text-sm font-medium text-gray-500 mt-2 leading-relaxed">This payment drastically missed its target window of {selectedCalendarItem.data.dueDate}. Start following up aggressively.</p>
                   </div>
                )}
             </div>
          </div>
       </div>
    );
 }

  return (
    <div className="p-5 max-w-[1400px] mx-auto space-y-6 bg-[var(--color-background)] min-h-screen pb-12">
       
       {renderCalendarModal()}

       <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1 flex items-center gap-2"><CalendarIcon size={24} className="text-primary"/> Execution Planner</h1>
            <p className="text-gray-500 text-sm font-medium">Your daily roadmap. Content, Deals, and Invoices perfectly synced.</p>
          </div>
          <button onClick={() => setIsQuickAddOpen(!isQuickAddOpen)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white transition-colors text-sm font-semibold shadow-sm shrink-0">
            <Plus size={16} /> Quick Add Idea
          </button>
       </div>

       {isQuickAddOpen && (
          <form onSubmit={handleQuickAdd} className="bg-card border border-primary/30 p-5 rounded-xl mb-6 shadow-md animate-in slide-in-from-top-4 flex gap-4 items-end">
             <div className="flex-1 space-y-1">
                 <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Content Title</label>
                 <input autoFocus required type="text" value={qTitle} onChange={e=>setQTitle(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-black/5 dark:bg-white/5 border border-border focus:outline-none focus:border-primary text-sm font-medium" placeholder="E.g. Morning Routine Vlog" />
             </div>
             <div className="w-32 md:w-40 space-y-1">
                 <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Platform</label>
                 <select value={qPlatform} onChange={e=>setQPlatform(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-black/5 dark:bg-white/5 border border-border focus:outline-none focus:border-primary text-sm font-medium appearance-none cursor-pointer">
                    <option className="bg-card">YouTube</option>
                    <option className="bg-card">Instagram</option>
                    <option className="bg-card">Newsletter</option>
                 </select>
             </div>
             <div className="w-24 md:w-40 space-y-1">
                 <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Format</label>
                 <input required type="text" value={qType} onChange={e=>setQType(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-black/5 dark:bg-white/5 border border-border focus:outline-none focus:border-primary text-sm font-medium" placeholder="Reel/Video" />
             </div>
             <div className="w-40 space-y-1">
                 <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Target Date</label>
                 <input required type="date" value={qDate} onChange={e=>setQDate(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-black/5 dark:bg-white/5 border border-border focus:outline-none focus:border-primary text-sm font-medium text-gray-700 dark:text-gray-300" />
             </div>
             <button type="submit" className="px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-bold shadow-md transition-colors h-9">Boom.</button>
          </form>
       )}

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 5. TODAY VIEW (Prioritized Urgency Panel) */}
          <div className="col-span-1 flex flex-col gap-6">
             <div className="bg-card border border-border rounded-xl p-5 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <h2 className="font-bold text-sm uppercase tracking-widest text-primary mb-5 flex items-center gap-2 relative z-10"><AlertCircle size={16}/> Action Required Today</h2>
                
                <div className="space-y-3 relative z-10">
                   {todaysTasks.length === 0 && todaysDeals.length === 0 && overduePayments.length === 0 && (
                      <div className="text-gray-500 text-sm font-medium p-4 border border-dashed border-border rounded-xl text-center">You are completely cleared for today!</div>
                   )}

                   {/* Content Block */}
                   {todaysTasks.map(task => (
                      <div key={task.id} className="flex gap-3 items-center p-3 border border-border rounded-xl bg-black/[0.02] dark:bg-white/[0.02] hover:border-primary/50 transition-colors cursor-pointer group" onClick={() => setSelectedCalendarItem({ type: 'content', data: task })}>
                         <div className="p-2 bg-black/5 dark:bg-white/5 rounded-lg text-gray-800 dark:text-gray-200 group-hover:text-primary transition-colors"><CalendarIcon size={16} /></div>
                         <div className="flex-1">
                            <div className="font-bold text-sm text-gray-800 dark:text-gray-200 leading-tight">{task.title}</div>
                            <div className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1.5 mt-0.5">{getPlatformIcon(task.platform)} {task.type}</div>
                         </div>
                      </div>
                   ))}

                   {/* Deals Block */}
                   {todaysDeals.map(deal => (
                      <div key={deal.id} className="flex gap-3 items-center p-3 border border-warning-text/30 rounded-xl bg-warning-text/5 hover:bg-warning-text/10 transition-colors cursor-pointer group" onClick={() => setSelectedCalendarItem({ type: 'deal', data: deal })}>
                         <div className="p-2 bg-warning-text/10 rounded-lg text-warning-text group-hover:scale-105 transition-transform"><Briefcase size={16} /></div>
                         <div className="flex-1">
                            <div className="font-bold text-sm text-gray-800 dark:text-gray-200 leading-tight">{deal.brand} Deadline</div>
                            <div className="text-[10px] font-bold text-warning-text uppercase mt-0.5">CRM Deal Sync Active</div>
                         </div>
                      </div>
                   ))}

                   {/* Severe Overdue/Payment Followups */}
                   {overduePayments.map(pay => (
                      <div key={pay.id} className="flex gap-3 items-center p-3 border border-danger-text/30 rounded-xl bg-danger-text/5 hover:bg-danger-text/10 transition-colors cursor-pointer group" onClick={() => setSelectedCalendarItem({ type: 'payment', data: pay })}>
                         <div className="p-2 bg-danger-text/10 rounded-lg text-danger-text group-hover:scale-105 transition-transform"><AlertCircle size={16} /></div>
                         <div className="flex-1">
                            <div className="font-bold text-sm text-gray-800 dark:text-gray-200 leading-tight">Follow up {pay.brand} invoice</div>
                            <div className="text-[10px] font-bold text-danger-text uppercase mt-0.5">₹{pay.amount.toLocaleString()} Overdue</div>
                         </div>
                      </div>
                   ))}
                </div>
             </div>

             {/* Dynamic Smart Stats */}
             <div className="bg-card border border-border rounded-xl p-5 shadow-sm hover:border-primary/50 transition-colors cursor-default">
                <span className="text-[10px] font-bold tracking-widest text-gray-500 mb-1 flex items-center gap-1">BOARD LOADS</span>
                <div className="text-3xl font-bold tracking-tight mb-2 text-gray-800 dark:text-gray-200">{contentTasks.length}</div>
                <div className="text-xs text-black/50 dark:text-white/50 font-medium">Ideas & Scripts physically waiting to be shot or posted.</div>
             </div>
          </div>

          <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
             
             {/* 1. VISUAL CALENDAR GRID */}
             <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-border flex justify-between items-center bg-black/[0.01] dark:bg-white/[0.01]">
                   <h2 className="font-bold text-sm uppercase tracking-widest text-gray-500 flex items-center gap-2"><CalendarIcon size={16}/> Master Schedule</h2>
                   <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded text-gray-500 hover:text-black dark:hover:text-white transition-colors"><ChevronLeft size={16}/></button>
                      <span className="text-xs font-bold w-20 text-center text-gray-800 dark:text-gray-200">This Week</span>
                      <button className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded text-gray-500 hover:text-black dark:hover:text-white transition-colors"><ChevronRight size={16}/></button>
                   </div>
                </div>
                
                <div className="grid grid-cols-7 border-b border-border text-center bg-black/[0.02] dark:bg-white/[0.02]">
                   {daysOfWeek.map(d => <div key={d} className="py-2.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest border-r border-border last:border-r-0">{d}</div>)}
                </div>
                <div className="grid grid-cols-7 min-h-[160px]">
                   {[1,2,3,4,5,6,7].map((cell, idx) => (
                      <div key={cell} className={`p-2 border-r border-border last:border-r-0 relative hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex flex-col gap-1.5 overflow-hidden ${idx === 2 ? 'bg-primary/[0.03]' : ''}`}>
                         <span className={`text-xs font-bold mb-1 ml-1 ${idx === 2 ? 'text-primary' : 'text-gray-400'}`}>{16 + idx}</span>
                         
                         {idx === 0 && overduePayments.map(p => (
                            <div key={p.id} onClick={(e) => { e.stopPropagation(); setSelectedCalendarItem({ type: 'payment', data: p }); }} className="text-[10px] font-bold text-danger-text bg-danger-text/10 px-1.5 py-1 rounded border border-danger-text/20 leading-none truncate cursor-pointer hover:bg-danger-text/20 transition-colors shadow-sm">Pay: {p.brand}</div>
                         ))}
                         
                         {idx === 2 && todaysTasks.map(t => (
                            <div key={t.id} onClick={(e) => { e.stopPropagation(); setSelectedCalendarItem({ type: 'content', data: t }); }} className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-1 rounded border border-primary/20 leading-none truncate cursor-pointer hover:bg-primary/20 transition-colors shadow-sm">{t.platform}</div>
                         ))}
                         
                         {idx === 3 && todaysDeals.map(d => (
                            <div key={d.id} onClick={(e) => { e.stopPropagation(); setSelectedCalendarItem({ type: 'deal', data: d }); }} className="text-[10px] font-bold text-warning-text bg-warning-text/10 px-1.5 py-1 rounded border border-warning-text/20 leading-none truncate cursor-pointer hover:bg-warning-text/20 transition-colors shadow-sm">Deal: {d.brand}</div>
                         ))}
                         
                         {/* Additional mock population for visual effect */}
                         {idx === 5 && (
                            <div className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-1 rounded border border-primary/20 leading-none truncate cursor-default shadow-sm opacity-50">YouTube</div>
                         )}
                      </div>
                   ))}
                </div>
             </div>

             {/* 2. CONTENT KANBAN LIST */}
             <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col flex-1">
                <div className="p-4 border-b border-border flex justify-between items-center bg-black/[0.01] dark:bg-white/[0.01]">
                   <h2 className="font-bold text-sm uppercase tracking-widest text-gray-500 flex items-center gap-2"><LayoutTemplate size={16}/> Content Queue</h2>
                </div>
                <div className="overflow-x-auto p-2">
                   <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead>
                          <tr className="text-gray-400 text-[10px] font-bold tracking-widest uppercase">
                              <th className="px-4 py-3">Video/Post Framework</th>
                              <th className="px-4 py-3">Target Date</th>
                              <th className="px-4 py-3">Execution Status</th>
                              <th className="px-4 py-3 text-right">Details</th>
                          </tr>
                      </thead>
                      <tbody>
                          {contentTasks.map(t => (
                             <tr key={t.id} className="hover:bg-black/5 dark:hover:bg-white/[0.02] transition-colors border-b border-border/30 last:border-0 group cursor-pointer" onClick={() => setSelectedCalendarItem({ type: 'content', data: t })}>
                                 <td className="px-4 py-3.5">
                                    <div className="font-bold text-gray-800 dark:text-gray-200 group-hover:text-primary transition-colors">{t.title}</div>
                                    <div className="text-[10px] font-bold text-gray-500 flex items-center gap-1.5 uppercase mt-0.5">{getPlatformIcon(t.platform)} {t.type}</div>
                                 </td>
                                 <td className="px-4 py-3.5">
                                    <span className="text-xs font-semibold text-foreground-muted bg-black/5 dark:bg-white/5 px-2.5 py-1 rounded-md border border-border/50 shadow-inner">{t.dueDate}</span>
                                 </td>
                                 <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                                    <select 
                                       value={t.status}
                                       onChange={(e) => updateContentTaskStatus(t.id, e.target.value as any)}
                                       className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-md w-fit outline-none cursor-pointer appearance-none shadow-sm transition-colors border ${
                                          t.status === 'Idea' ? 'bg-black/5 dark:bg-white/5 text-gray-700 dark:text-gray-300 border-border' :
                                          t.status === 'In Progress' ? 'bg-primary/10 text-primary border-primary/20' :
                                          t.status === 'Ready' ? 'bg-warning-text/10 text-warning-text border-warning-text/20' :
                                          'bg-success-bg text-success-text border-success-text/20'
                                       }`}
                                    >
                                       <option className="bg-card text-gray-900 dark:text-white" value="Idea">Idea Phase</option>
                                       <option className="bg-card text-gray-900 dark:text-white" value="In Progress">In Progress</option>
                                       <option className="bg-card text-gray-900 dark:text-white" value="Ready">Ready to Post</option>
                                       <option className="bg-card text-gray-900 dark:text-white" value="Posted">Posted!</option>
                                    </select>
                                 </td>
                                 <td className="px-4 py-3.5 text-right">
                                     <button className="text-[10px] font-bold text-gray-500 bg-black/5 dark:bg-white/5 hover:bg-primary/10 hover:text-primary px-3 py-1.5 rounded-lg transition-colors border border-border">Open</button>
                                 </td>
                             </tr>
                          ))}
                      </tbody>
                   </table>
                </div>
             </div>

          </div>
       </div>

    </div>
  )
}
