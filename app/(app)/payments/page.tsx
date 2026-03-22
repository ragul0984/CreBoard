'use client';
import { useState } from 'react';
import { Search, Filter, DollarSign, Clock, AlertCircle, CheckCircle2, FileText, Download, ArrowRight, CornerDownRight, X, Plus, Trash2 } from 'lucide-react';
import { useStore } from '@/src/store';

const formatDateObj = (dateStr: string) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(parts[1], 10)-1]} ${parseInt(parts[2], 10)}, ${parts[0]}`;
};

const STATUS_FILTERS = ['All', 'Pending', 'Overdue', 'Paid'];

export default function PaymentsPage() {
  const payments = useStore(state => state.payments);
  const markPaymentReceived = useStore(state => state.markPaymentReceived);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Receive modal
  const [receivingPayment, setReceivingPayment] = useState<any>(null);
  const [receivedDate, setReceivedDate] = useState(new Date().toISOString().split('T')[0]);

  // Detail modal (click on row)
  const [detailPayment, setDetailPayment] = useState<any>(null);

  // Invoice modal
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({ brand: '', deal: '', amount: '', dueDate: '', notes: '' });

  const totalPending = payments.filter(p => ['Pending', 'Overdue'].includes(p.status)).reduce((sum, p) => sum + p.amount, 0);
  const totalOverdue = payments.filter(p => p.status === 'Overdue').reduce((sum, p) => sum + p.amount, 0);
  const totalPaid = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);

  const filteredPayments = payments.filter(p => {
    const matchSearch = p.brand.toLowerCase().includes(searchQuery.toLowerCase()) || p.dealName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleConfirmReceive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!receivingPayment) return;
    markPaymentReceived(receivingPayment.id, receivedDate);
    setReceivingPayment(null);
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceForm.brand || !invoiceForm.amount) return;

    useStore.getState().addDeal({
       id: Math.random().toString(36).substr(2, 9),
       brand: invoiceForm.brand,
       platform: 'Manual Invoice',
       deliverable: invoiceForm.deal || 'Invoice',
       value: Number(invoiceForm.amount),
       deadline: invoiceForm.dueDate || new Date().toISOString().split('T')[0],
       stage: 'Delivered',
       isCompleted: false
    });

    setShowInvoiceModal(false);
    setInvoiceForm({ brand: '', deal: '', amount: '', dueDate: '', notes: '' });
  };

  return (
    <div className="p-5 max-w-[1400px] mx-auto space-y-6 bg-[var(--color-background)] min-h-screen">

      {/* ── Payment Detail Modal ── */}
      {detailPayment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDetailPayment(null)}>
          <div className="bg-card border border-border rounded-2xl w-[440px] shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-border flex justify-between items-center bg-black/[0.02]">
              <h2 className="font-bold text-base flex items-center gap-2"><DollarSign size={16} className="text-primary"/> Payment Detail</h2>
              <button onClick={() => setDetailPayment(null)} className="p-1 rounded-md bg-black/5 dark:bg-white/5 text-gray-500 hover:text-black dark:hover:text-white"><X size={16} strokeWidth={3}/></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="text-center pb-4 border-b border-border">
                <div className="text-xs font-bold text-foreground-muted uppercase tracking-widest mb-1">Amount</div>
                <div className="text-4xl font-black text-foreground tracking-tight">₹{detailPayment.amount.toLocaleString()}</div>
                <span className={`mt-2 inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                  detailPayment.status === 'Paid' ? 'bg-success-bg text-success-text' :
                  detailPayment.status === 'Overdue' ? 'bg-danger-text/20 text-danger-text' :
                  'bg-warning-text/20 text-warning-text'}`}>{detailPayment.status}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-border">
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Brand</div>
                  <div className="font-bold text-sm">{detailPayment.brand}</div>
                </div>
                <div className="bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-border">
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Platform</div>
                  <div className="font-bold text-sm">{detailPayment.platform}</div>
                </div>
                <div className="bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-border col-span-2">
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Deal / Deliverable</div>
                  <div className="font-bold text-sm">{detailPayment.dealName}</div>
                </div>
                <div className="bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-border">
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Due Date</div>
                  <div className="font-bold text-sm">{formatDateObj(detailPayment.dueDate)}</div>
                </div>
                {detailPayment.receivedDate && (
                  <div className="bg-success-bg/20 p-3 rounded-xl border border-success-bg">
                    <div className="text-[10px] font-bold text-success-text uppercase tracking-widest mb-1">Received On</div>
                    <div className="font-bold text-sm text-success-text">{formatDateObj(detailPayment.receivedDate)}</div>
                  </div>
                )}
              </div>
              {detailPayment.status !== 'Paid' && (
                <button
                  onClick={() => { setDetailPayment(null); setReceivingPayment(detailPayment); }}
                  className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={16}/> Mark as Received
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Receive Payment Modal ── */}
      {receivingPayment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setReceivingPayment(null)}>
          <div className="bg-card border border-border rounded-2xl w-[450px] shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-border bg-primary/5">
              <h2 className="text-xl font-bold flex items-center gap-2 text-primary"><DollarSign size={20}/> Log Payment Received</h2>
              <p className="text-sm text-foreground-muted font-medium mt-1">This will automatically generate a Revenue record.</p>
            </div>
            <form onSubmit={handleConfirmReceive} className="p-6 space-y-5">
              <div className="bg-foreground/5 p-4 rounded-xl border border-border">
                <div className="text-xs font-bold text-foreground-muted uppercase tracking-wider mb-1">Invoice Details</div>
                <div className="font-bold text-foreground">{receivingPayment.brand} — {receivingPayment.dealName}</div>
                <div className="text-xl font-bold text-success-text mt-2">₹{receivingPayment.amount.toLocaleString()}</div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Date Received</label>
                <input required type="date" value={receivedDate} onChange={e => setReceivedDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-foreground/5 border border-border focus:outline-none focus:border-primary text-sm font-medium text-foreground"/>
              </div>
              <div className="bg-success-bg/30 text-success-text p-3 rounded-xl flex items-start gap-2 text-xs font-medium border border-success-text/20">
                <CheckCircle2 size={14} className="shrink-0 mt-0.5"/>
                <p>Marking as received will create a corresponding entry in your <strong>Revenue Hub</strong>.</p>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button type="button" onClick={() => setReceivingPayment(null)} className="px-5 py-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-400">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-bold shadow-md transition-colors">Confirm & Log Revenue</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Create Invoice Modal ── */}
      {showInvoiceModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowInvoiceModal(false)}>
          <div className="bg-card border border-border rounded-2xl w-[480px] shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-border flex justify-between items-center bg-black/[0.02]">
              <h2 className="font-bold text-base flex items-center gap-2"><FileText size={16} className="text-primary"/> Create Invoice</h2>
              <button onClick={() => setShowInvoiceModal(false)} className="p-1 rounded-md bg-black/5 dark:bg-white/5 text-gray-500 hover:text-black dark:hover:text-white"><X size={16} strokeWidth={3}/></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Brand Name</label>
                  <input type="text" placeholder="e.g. Nike" value={invoiceForm.brand} onChange={e => setInvoiceForm(f => ({...f, brand: e.target.value}))}
                    className="w-full px-3 py-2 rounded-lg bg-black/5 dark:bg-white/5 border border-border focus:outline-none focus:border-primary text-sm"/>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Deal / Deliverable</label>
                  <input type="text" placeholder="e.g. 1x Reel" value={invoiceForm.deal} onChange={e => setInvoiceForm(f => ({...f, deal: e.target.value}))}
                    className="w-full px-3 py-2 rounded-lg bg-black/5 dark:bg-white/5 border border-border focus:outline-none focus:border-primary text-sm"/>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Amount (₹)</label>
                  <input type="number" placeholder="0" value={invoiceForm.amount} onChange={e => setInvoiceForm(f => ({...f, amount: e.target.value}))}
                    className="w-full px-3 py-2 rounded-lg bg-black/5 dark:bg-white/5 border border-border focus:outline-none focus:border-primary text-sm"/>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Due Date</label>
                  <input type="date" value={invoiceForm.dueDate} onChange={e => setInvoiceForm(f => ({...f, dueDate: e.target.value}))}
                    className="w-full px-3 py-2 rounded-lg bg-black/5 dark:bg-white/5 border border-border focus:outline-none focus:border-primary text-sm text-gray-700 dark:text-gray-300"/>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Notes (optional)</label>
                <textarea rows={2} placeholder="Payment terms, reminders..." value={invoiceForm.notes} onChange={e => setInvoiceForm(f => ({...f, notes: e.target.value}))}
                  className="w-full px-3 py-2 rounded-lg bg-black/5 dark:bg-white/5 border border-border focus:outline-none focus:border-primary text-sm resize-none"/>
              </div>
              <div className="bg-primary/5 border border-primary/20 p-3 rounded-xl text-xs text-primary font-medium">
                Invoice will be created as a <strong>Pending</strong> payment entry and appear in the tracker below.
              </div>
              <div className="flex justify-end gap-3 pt-2 border-t border-border">
                <button type="button" onClick={() => setShowInvoiceModal(false)} className="px-4 py-2 rounded-lg text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5">Cancel</button>
                <button type="button" onClick={handleCreateInvoice} className="px-5 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-bold shadow-md transition-colors flex items-center gap-2">
                  <Plus size={14}/> Create Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Invoices & Payments</h1>
          <p className="text-gray-500 text-sm font-medium">Track outstanding cash flow and log received deals.</p>
        </div>
        <div className="flex gap-3 relative">
          <button
            onClick={() => setShowFilterPanel(p => !p)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors text-sm font-semibold shadow-sm ${showFilterPanel ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-card border-border hover:bg-black/5 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200'}`}
          >
            <Filter size={16}/> Filters {statusFilter !== 'All' && <span className="bg-primary text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">1</span>}
          </button>
          {showFilterPanel && (
            <div className="absolute top-full right-0 mt-2 bg-card border border-border rounded-xl shadow-xl z-30 p-3 w-48">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Status</div>
              {STATUS_FILTERS.map(s => (
                <button key={s} onClick={() => { setStatusFilter(s); setShowFilterPanel(false); }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${statusFilter === s ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}>
                  {s} {statusFilter === s && <CheckCircle2 size={12}/>}
                </button>
              ))}
            </div>
          )}
          <button
            onClick={() => setShowInvoiceModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white transition-colors text-sm font-semibold shadow-sm"
          >
            <FileText size={16}/> Create Invoice
          </button>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-card border border-border p-5 rounded-xl flex flex-col">
          <span className="text-[10px] font-bold tracking-widest text-warning-text mb-1 flex items-center gap-1"><Clock size={12}/> TOTAL PENDING</span>
          <div className="text-3xl font-bold tracking-tight mb-1 text-foreground">₹{totalPending.toLocaleString()}</div>
          <div className="text-xs text-foreground-muted font-medium">Awaiting payment</div>
        </div>
        <div className="bg-card border border-danger-text/30 p-5 rounded-xl flex flex-col shadow-[0_0_15px_rgba(239,68,68,0.05)]">
          <span className="text-[10px] font-bold tracking-widest text-danger-text mb-1 flex items-center gap-1"><AlertCircle size={12}/> SEVERELY OVERDUE</span>
          <div className="text-3xl font-bold text-danger-text tracking-tight mb-1">₹{totalOverdue.toLocaleString()}</div>
          <div className="text-xs text-danger-text/80 font-medium">Requires follow-up</div>
        </div>
        <div className="bg-card border border-success-text/30 p-5 rounded-xl flex flex-col shadow-[0_0_15px_rgba(16,185,129,0.05)]">
          <span className="text-[10px] font-bold tracking-widest text-success-text mb-1 flex items-center gap-1"><CheckCircle2 size={12}/> TOTAL RECEIVED</span>
          <div className="text-3xl font-bold text-success-text tracking-tight mb-1">₹{totalPaid.toLocaleString()}</div>
          <div className="text-xs text-success-text/80 font-medium">Cleared to bank</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border flex justify-between items-center bg-black/[0.01] dark:bg-white/[0.01]">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search payments, deals or brands..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-black/5 dark:bg-white/5 focus:outline-none focus:border-primary transition-colors text-sm"/>
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 text-gray-500 hover:text-black dark:hover:text-white transition-colors text-xs font-bold uppercase tracking-wider">
            <Download size={14}/> Export CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-black/5 dark:bg-black/20">
              <tr className="text-gray-500 text-[10px] font-bold tracking-widest uppercase border-b border-border">
                <th className="px-6 py-4">Brand & Deal</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 dark:text-gray-300 font-medium">
              {filteredPayments.map(payment => (
                <tr
                  key={payment.id}
                  onClick={() => setDetailPayment(payment)}
                  className="hover:bg-black/5 dark:hover:bg-white/[0.02] transition-colors border-b border-border/50 group cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="font-bold text-foreground group-hover:text-primary transition-colors">{payment.brand}</div>
                    <div className="text-xs text-foreground-muted flex items-center gap-1 mt-0.5"><CornerDownRight size={10}/> {payment.dealName}</div>
                  </td>
                  <td className="px-6 py-4 font-bold text-base text-foreground">₹{payment.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className={`text-xs font-semibold ${payment.status === 'Overdue' ? 'text-danger-text' : 'text-gray-500'}`}>
                      {payment.status === 'Paid' && payment.receivedDate ? (<>Received<br/>{formatDateObj(payment.receivedDate)}</>) : formatDateObj(payment.dueDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${
                      payment.status === 'Paid' ? 'bg-success-bg text-success-text' :
                      payment.status === 'Overdue' ? 'bg-danger-text/20 text-danger-text' :
                      'bg-warning-text/20 text-warning-text'}`}>{payment.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-2" onClick={e => e.stopPropagation()}>
                    {payment.status === 'Paid' ? (
                      <span className="flex items-center justify-end gap-1.5 text-xs font-bold text-success-text mr-2"><CheckCircle2 size={14}/> Logged</span>
                    ) : (
                      <button
                        onClick={() => setReceivingPayment(payment)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/5 dark:bg-white/10 hover:bg-primary/20 hover:text-primary transition-colors rounded-lg text-xs font-bold border border-transparent shadow-sm"
                      >
                        Mark Received <ArrowRight size={12}/>
                      </button>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); useStore.getState().deletePayment(payment.id); }}
                      className="p-1.5 text-gray-400 hover:text-danger-text hover:bg-danger-bg/20 rounded-lg transition-colors"
                      title="Delete Invoice"
                    >
                      <Trash2 size={16}/>
                    </button>
                  </td>
                </tr>
              ))}
              {filteredPayments.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500 text-sm font-medium">No payments found matching your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
