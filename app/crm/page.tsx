'use client';
import { useState } from 'react';
import { useStore, BrandProfile } from '../../src/store';
import { Star, Briefcase, DollarSign, Clock, AlertCircle, CheckCircle2, Users, Search, MessageSquare, X, User, Plus, Trash2, Edit2 } from 'lucide-react';

const formatDateObj = (dateStr: string) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(parts[1], 10)-1]} ${parseInt(parts[2], 10)}, ${parts[0]}`;
};

export default function CRMPage() {
  const brands = useStore(state => state.brands);
  const deals = useStore(state => state.deals);
  const payments = useStore(state => state.payments);

  const addBrand = useStore(state => state.addBrand);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<BrandProfile | null>(null);
  const [showNewBrandModal, setShowNewBrandModal] = useState(false);
  const [newBrandForm, setNewBrandForm] = useState({ name: '', contactPerson: '', platform: 'Instagram', industry: '', rating: 5 });

  const [isEditingBrand, setIsEditingBrand] = useState(false);
  const [editBrandForm, setEditBrandForm] = useState<Partial<BrandProfile>>({});

  // Compute live aggregates for a single brand
  const getBrandStats = (brandName: string) => {
     const brandDeals = deals.filter(d => d.brand === brandName);
     const brandPayments = payments.filter(p => p.brand === brandName);
     
     const totalEarned = brandDeals.filter(d => d.isCompleted).reduce((sum, d) => sum + d.value, 0);
     const totalDeals = brandDeals.length;
     const lateCount = brandPayments.filter(p => p.status === 'Overdue' || (p.receivedDate && p.dueDate && new Date(p.receivedDate) > new Date(p.dueDate))).length;
     const pendingCash = brandPayments.filter(p => p.status !== 'Paid').reduce((sum, p) => sum + p.amount, 0);

     return { brandDeals, brandPayments, totalEarned, totalDeals, lateCount, pendingCash };
  };

  const filteredBrands = brands.filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.industry.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleAddBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandForm.name.trim()) return;
    addBrand({
      id: crypto.randomUUID(),
      name: newBrandForm.name.trim(),
      contactPerson: newBrandForm.contactPerson.trim() || 'Unknown',
      platform: newBrandForm.platform,
      industry: newBrandForm.industry.trim() || 'General',
      rating: newBrandForm.rating,
      notes: []
    });
    setNewBrandForm({ name: '', contactPerson: '', platform: 'Instagram', industry: '', rating: 5 });
    setShowNewBrandModal(false);
  };

  // Insights computations
  const sortedByEarnings = [...brands].sort((a, b) => getBrandStats(b.name).totalEarned - getBrandStats(a.name).totalEarned);
  const topPayingBrand = sortedByEarnings[0];
  const mostReliableBrand = brands.filter(b => getBrandStats(b.name).lateCount === 0).sort((a, b) => b.rating - a.rating)[0] || brands[0];
  const brandsWithDelays = brands.filter(b => getBrandStats(b.name).lateCount > 0).length;

  return (
    <div className="p-5 max-w-[1400px] mx-auto space-y-6 bg-[var(--color-background)] min-h-screen pb-12">

      {/* New Brand Modal */}
      {showNewBrandModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowNewBrandModal(false)}>
          <div className="bg-card border border-border rounded-2xl w-[460px] shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-border flex justify-between items-center bg-black/[0.02]">
              <h2 className="font-bold text-base flex items-center gap-2"><Plus size={16} className="text-primary"/> Add New Brand</h2>
              <button onClick={() => setShowNewBrandModal(false)} className="p-1 rounded-md bg-black/5 dark:bg-white/5 text-gray-500 hover:text-black dark:hover:text-white"><X size={16} strokeWidth={3}/></button>
            </div>
            <form onSubmit={handleAddBrand} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Brand Name *</label>
                  <input required type="text" placeholder="e.g. Nike" value={newBrandForm.name} onChange={e => setNewBrandForm(f => ({...f, name: e.target.value}))}
                    className="w-full px-3 py-2 rounded-lg bg-black/5 dark:bg-white/5 border border-border focus:outline-none focus:border-primary text-sm"/>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Contact Person</label>
                  <input type="text" placeholder="e.g. Sarah J." value={newBrandForm.contactPerson} onChange={e => setNewBrandForm(f => ({...f, contactPerson: e.target.value}))}
                    className="w-full px-3 py-2 rounded-lg bg-black/5 dark:bg-white/5 border border-border focus:outline-none focus:border-primary text-sm"/>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Primary Platform</label>
                  <select value={newBrandForm.platform} onChange={e => setNewBrandForm(f => ({...f, platform: e.target.value}))}
                    className="w-full px-3 py-2 rounded-lg bg-black/5 dark:bg-white/5 border border-border focus:outline-none focus:border-primary text-sm appearance-none">
                    {['Instagram','YouTube','Twitter','LinkedIn','Newsletter'].map(p => <option key={p} className="bg-card">{p}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Industry</label>
                  <input type="text" placeholder="e.g. Fashion, Tech" value={newBrandForm.industry} onChange={e => setNewBrandForm(f => ({...f, industry: e.target.value}))}
                    className="w-full px-3 py-2 rounded-lg bg-black/5 dark:bg-white/5 border border-border focus:outline-none focus:border-primary text-sm"/>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Initial Rating</label>
                <div className="flex items-center gap-2">
                  {[1,2,3,4,5].map(n => (
                    <button key={n} type="button" onClick={() => setNewBrandForm(f => ({...f, rating: n}))}>
                      <Star size={24} className={n <= newBrandForm.rating ? 'text-warning-text fill-warning-text' : 'text-gray-300 dark:text-gray-700'}/>
                    </button>
                  ))}
                  <span className="text-sm font-bold text-gray-600 dark:text-gray-400 ml-1">{newBrandForm.rating}/5</span>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2 border-t border-border">
                <button type="button" onClick={() => setShowNewBrandModal(false)} className="px-4 py-2 rounded-lg text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-bold shadow-md transition-colors flex items-center gap-2"><Plus size={14}/> Add Brand</button>
              </div>
            </form>
          </div>
        </div>
      )}
       
       {/* Details Slider / Modal */}
       {selectedBrand && (
          <div className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-card border-l border-border shadow-2xl z-50 animate-in slide-in-from-right duration-300 flex flex-col h-full ring-1 ring-black/5">
             
             {/* Header Identity */}
             <div className="p-6 border-b border-border bg-black/[0.02] dark:bg-white/[0.02] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                   <div className="flex-1 min-w-0 pr-4">
                      {isEditingBrand ? (
                        <div className="space-y-2 w-full">
                          <input 
                            className="text-3xl font-black bg-black/5 dark:bg-white/10 border border-border rounded px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-primary h-12"
                            value={editBrandForm.name || ''}
                            onChange={e => setEditBrandForm(f => ({...f, name: e.target.value}))}
                          />
                          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
                            <input 
                              className="font-bold text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20 w-32 focus:outline-none focus:ring-1 focus:ring-primary"
                              value={editBrandForm.industry || ''}
                              onChange={e => setEditBrandForm(f => ({...f, industry: e.target.value}))}
                              placeholder="Industry..."
                            />
                            <div className="flex items-center gap-1.5 flex-1 min-w-[140px] bg-black/5 dark:bg-white/5 border border-border px-2 py-1 rounded focus-within:ring-1 focus-within:ring-primary">
                              <User size={14} className="text-gray-500 shrink-0"/>
                              <input 
                                className="font-bold text-gray-600 dark:text-gray-300 bg-transparent w-full focus:outline-none"
                                value={editBrandForm.contactPerson || ''}
                                onChange={e => setEditBrandForm(f => ({...f, contactPerson: e.target.value}))}
                                placeholder="Contact Person..."
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2 truncate">{selectedBrand.name}</h2>
                          <div className="flex items-center gap-3 mt-2 flex-wrap">
                             <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">{selectedBrand.industry}</span>
                             <span className="text-xs font-bold text-gray-600 dark:text-gray-300 flex items-center gap-1.5"><User size={14}/> {selectedBrand.contactPerson}</span>
                          </div>
                        </>
                      )}
                   </div>
                   <div className="flex items-start gap-2 shrink-0">
                     {isEditingBrand ? (
                       <button
                         onClick={() => {
                           useStore.getState().updateBrand(selectedBrand.id, editBrandForm);
                           setSelectedBrand({ ...selectedBrand, ...editBrandForm } as BrandProfile);
                           setIsEditingBrand(false);
                         }}
                         className="p-1.5 rounded-lg bg-success-text/20 text-success-text hover:bg-success-text hover:text-white transition-colors"
                         title="Save Brand Details"
                       >
                         <CheckCircle2 size={18} strokeWidth={2.5}/>
                       </button>
                     ) : (
                       <button
                         onClick={() => {
                           setEditBrandForm(selectedBrand);
                           setIsEditingBrand(true);
                         }}
                         className="p-1.5 rounded-lg text-gray-400 hover:bg-primary/20 hover:text-primary transition-colors"
                         title="Edit Brand details"
                       >
                         <Edit2 size={18} strokeWidth={2.5}/>
                       </button>
                     )}
                     <button
                       onClick={() => { useStore.getState().deleteBrand(selectedBrand.id); setSelectedBrand(null); setIsEditingBrand(false); }}
                       className="p-1.5 rounded-lg text-gray-400 hover:bg-danger-bg/20 hover:text-danger-text transition-colors"
                       title="Delete Brand"
                     >
                       <Trash2 size={18} strokeWidth={2.5}/>
                     </button>
                     <button onClick={() => { setSelectedBrand(null); setIsEditingBrand(false); }} className="p-1.5 rounded-lg bg-black/5 dark:bg-white/5 text-gray-500 hover:text-black dark:hover:text-white transition-colors">
                       <X size={18} strokeWidth={3}/>
                     </button>
                   </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6 relative z-10">
                   <div>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Total Earned</span>
                      <div className="text-xl font-black text-success-text tracking-tight">₹{getBrandStats(selectedBrand.name).totalEarned.toLocaleString()}</div>
                   </div>
                   <div>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Deals Closed</span>
                      <div className="text-xl font-bold tracking-tight text-gray-800 dark:text-gray-200">{getBrandStats(selectedBrand.name).totalDeals}</div>
                   </div>
                   <div>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Rating</span>
                      <div className="text-xl font-bold tracking-tight text-warning-text flex items-center gap-1">
                         {selectedBrand.rating} <Star size={18} fill="currentColor" strokeWidth={0}/>
                      </div>
                   </div>
                </div>
             </div>

             <div className="flex-1 overflow-y-auto p-6 space-y-6">
                 
                 {/* Payment Behavior (Killer Feature) */}
                 <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                    <div className="p-3 border-b border-border bg-black/[0.01] dark:bg-white/[0.01] flex items-center justify-between">
                       <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2"><DollarSign size={14}/> Payment Behavior Data</h3>
                       {getBrandStats(selectedBrand.name).lateCount > 0 ? (
                           <span className="bg-danger-text/10 text-danger-text text-[10px] font-bold px-2 py-0.5 rounded border border-danger-text/20">High Risk</span>
                       ) : (
                           <span className="bg-success-bg/20 text-success-text text-[10px] font-bold px-2 py-0.5 rounded border border-success-bg">Reliable Partner</span>
                       )}
                    </div>
                    <div className="grid grid-cols-2 gap-4 p-4">
                       <div className="bg-black/5 dark:bg-white/[0.02] border border-border p-3 rounded-xl">
                           <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Avg Payment Time</span>
                           <div className="text-lg font-bold text-gray-800 dark:text-gray-200">12 Days</div>
                       </div>
                       <div className="bg-black/5 dark:bg-white/[0.02] border border-border p-3 rounded-xl">
                           <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Late Occurrences</span>
                           <div className={`text-lg font-bold ${getBrandStats(selectedBrand.name).lateCount > 0 ? 'text-danger-text' : 'text-gray-800 dark:text-gray-200'}`}>
                               {getBrandStats(selectedBrand.name).lateCount}
                           </div>
                       </div>
                       {getBrandStats(selectedBrand.name).pendingCash > 0 && (
                          <div className="col-span-2 bg-warning-text/10 border border-warning-text/20 p-3 rounded-xl flex justify-between items-center">
                              <div>
                                 <span className="text-[10px] font-bold text-warning-text uppercase tracking-widest block mb-0.5">Currently Pending Cash</span>
                                 <div className="text-xs font-bold text-warning-text/70">{getBrandStats(selectedBrand.name).brandPayments.filter(p=>p.status!=='Paid').length} Open Invoice(s)</div>
                              </div>
                              <div className="text-lg font-bold text-warning-text">₹{getBrandStats(selectedBrand.name).pendingCash.toLocaleString()}</div>
                          </div>
                       )}
                    </div>
                 </div>

                 {/* Deal History */}
                 <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                    <div className="p-3 border-b border-border bg-black/[0.01] dark:bg-white/[0.01]">
                       <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2"><Briefcase size={14}/> Deal History</h3>
                    </div>
                    <div className="divide-y divide-border">
                       {getBrandStats(selectedBrand.name).brandDeals.map(d => (
                           <div key={d.id} className="p-4 hover:bg-black/5 dark:hover:bg-white/[0.02] transition-colors flex justify-between items-center group cursor-pointer">
                               <div>
                                  <div className="font-bold text-sm text-gray-800 dark:text-gray-200 group-hover:text-primary transition-colors">{d.deliverable}</div>
                                  <div className="text-[10px] font-bold text-gray-500 mt-1 uppercase flex items-center gap-1.5"><Clock size={10}/> Due {formatDateObj(d.deadline)}</div>
                               </div>
                               <div className="text-right flex items-center gap-3">
                                  <span className="font-bold text-sm">₹{d.value.toLocaleString()}</span>
                                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-md w-16 text-center ${
                                     d.stage === 'Paid' ? 'bg-success-bg text-success-text' : 
                                     d.stage === 'Active' ? 'bg-warning-text/20 text-warning-text' : 
                                     'bg-primary/10 text-primary'
                                  }`}>{d.stage}</span>
                               </div>
                           </div>
                       ))}
                       {getBrandStats(selectedBrand.name).brandDeals.length === 0 && (
                          <div className="p-4 text-center text-xs text-gray-500 font-bold border-dashed border-border rounded-xl m-2 border">No deals recorded yet.</div>
                       )}
                    </div>
                 </div>

                 {/* Interaction Notes */}
                 <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                    <div className="p-3 border-b border-border bg-black/[0.01] dark:bg-white/[0.01] flex justify-between items-center">
                       <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2"><MessageSquare size={14}/> Interaction Memory</h3>
                       <button className="text-[10px] font-bold text-primary hover:underline">Add Note</button>
                    </div>
                    <div className="p-4 space-y-3">
                        {selectedBrand.notes.map(note => (
                           <div key={note.id} className="bg-black/5 dark:bg-white/5 p-3 rounded-lg border border-border shadow-inner">
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed">"{note.text}"</p>
                              <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-2">{formatDateObj(note.date)}</div>
                           </div>
                        ))}
                        {selectedBrand.notes.length === 0 && (
                           <div className="text-center text-xs text-gray-500 font-bold border-dashed border-border rounded-xl p-4 border">Your mental notes drop here avoiding scattered WhatsApp chats.</div>
                        )}
                    </div>
                 </div>

             </div>
          </div>
       )}

       {/* INsights Header Blocks */}
       <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1 flex items-center gap-2"><Users size={24} className="text-primary"/> Brand CRM</h1>
            <p className="text-gray-500 text-sm font-medium">Your historical rolodex of brand relationships, ratings, and payment behaviors.</p>
          </div>
       </div>

       {/* 6. Insights Banner Boxes */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-card border border-border p-5 rounded-xl shadow-sm relative overflow-hidden">
             <span className="text-[10px] font-bold tracking-widest text-gray-500 mb-1 flex items-center gap-1 uppercase block">Top Paying Brand</span>
             <div className="text-2xl font-black tracking-tight text-primary mt-1">{topPayingBrand?.name || 'None'}</div>
             <div className="text-xs text-gray-500 font-semibold mt-1">₹{getBrandStats(topPayingBrand?.name || '').totalEarned.toLocaleString()} Total Output</div>
          </div>
          <div className="bg-card border border-border p-5 rounded-xl shadow-sm relative overflow-hidden">
             <span className="text-[10px] font-bold tracking-widest text-gray-500 mb-1 flex items-center gap-1 uppercase block">Most Reliable Brand</span>
             <div className="text-2xl font-black tracking-tight text-success-text mt-1">{mostReliableBrand?.name || 'None'}</div>
             <div className="text-xs text-gray-500 font-semibold mt-1">Zero late payments recorded</div>
          </div>
          <div className="bg-card border border-border p-5 rounded-xl shadow-sm relative overflow-hidden">
             <span className="text-[10px] font-bold tracking-widest text-gray-500 mb-1 flex items-center gap-1 uppercase block">Brands With Delays</span>
             <div className={`text-2xl font-black tracking-tight mt-1 ${brandsWithDelays > 0 ? 'text-danger-text' : 'text-gray-800 dark:text-gray-200'}`}>{brandsWithDelays}</div>
             <div className="text-xs text-gray-500 font-semibold mt-1">Sponsoring entities missing deadlines</div>
          </div>
       </div>

       {/* Brand List Table */}
       <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden mt-6">
          <div className="p-4 border-b border-border flex justify-between items-center bg-black/[0.01] dark:bg-white/[0.01]">
             <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search brand or industry..." 
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-black/5 dark:bg-white/5 focus:outline-none focus:border-primary transition-colors text-sm font-medium"
                />
             </div>
             <button onClick={() => setShowNewBrandModal(true)} className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-bold shadow-sm transition-colors">
                 <Plus size={14}/> New Brand
             </button>
          </div>

          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-black/5 dark:bg-black/20">
                    <tr className="text-gray-500 text-[10px] font-bold tracking-widest uppercase border-b border-border">
                        <th className="px-6 py-4">Brand Profile</th>
                        <th className="px-6 py-4">Total Earned</th>
                        <th className="px-6 py-4">Payment Health</th>
                        <th className="px-6 py-4">Reliability Rating</th>
                        <th className="px-6 py-4 text-right">Details</th>
                    </tr>
                </thead>
                <tbody className="text-gray-700 dark:text-gray-300 font-medium">
                    {filteredBrands.map(brand => {
                       const stats = getBrandStats(brand.name);
                       return (
                          <tr 
                             key={brand.id} 
                             onClick={() => setSelectedBrand(brand)}
                             className="hover:bg-black/5 dark:hover:bg-white/[0.02] transition-colors border-b border-border/50 group cursor-pointer"
                          >
                              <td className="px-6 py-4">
                                 <div className="font-bold text-black dark:text-white text-base group-hover:text-primary transition-colors">{brand.name}</div>
                                 <div className="text-[10px] text-gray-500 flex items-center gap-1 font-bold bg-black/5 dark:bg-white/5 w-fit px-2 py-0.5 rounded border border-border mt-1">
                                    {brand.industry}
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <div className="font-bold text-base text-gray-800 dark:text-gray-200">₹{stats.totalEarned.toLocaleString()}</div>
                                 <div className="text-[10px] text-gray-500 font-bold uppercase mt-1">{stats.totalDeals} Deals Closed</div>
                              </td>
                              <td className="px-6 py-4">
                                 {stats.lateCount > 0 ? (
                                    <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-danger-text bg-danger-text/10 px-2.5 py-1 rounded-md border border-danger-text/20 w-fit">
                                       <AlertCircle size={10} strokeWidth={3}/> {stats.lateCount} Late payment
                                    </span>
                                 ) : (
                                    <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-success-text bg-success-bg/20 px-2.5 py-1 rounded-md border border-success-bg w-fit">
                                       <CheckCircle2 size={10} strokeWidth={3}/> Excellent
                                    </span>
                                 )}
                              </td>
                              <td className="px-6 py-4">
                                 <div className="flex items-center gap-1">
                                    <span className="font-bold text-sm mr-1">{brand.rating.toFixed(1)}</span>
                                    {[...Array(5)].map((_, i) => (
                                       <Star key={i} size={14} className={i < brand.rating ? 'text-warning-text fill-warning-text' : 'text-gray-300 dark:text-gray-700'} />
                                    ))}
                                 </div>
                              </td>
                              <td className="px-6 py-4 text-right">
                                 <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/5 dark:bg-white/10 group-hover:bg-primary/10 group-hover:border-primary/20 group-hover:text-primary transition-colors rounded-lg text-xs font-bold border border-transparent shadow-sm">
                                   View Notes
                                 </button>
                              </td>
                          </tr>
                       )
                    })}
                    {filteredBrands.length === 0 && (
                       <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-gray-500 text-sm font-medium">
                             No brands found matching your search.
                          </td>
                       </tr>
                    )}
                </tbody>
             </table>
          </div>
       </div>

    </div>
  )
}
