'use client';

import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/src/store';
import { ArrowLeft, Printer, Download, Share2, CheckCircle2, IndianRupee, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function InvoicePage() {
  const params = useParams();
  const router = useRouter();
  const dealId = params.id as string;
  
  const deals = useStore(state => state.deals);
  const userName = useStore(state => state.userName);
  const userEmail = useStore(state => state.userEmail);
  const billingAddress = useStore(state => state.billingAddress);
  const panGst = useStore(state => state.panGst);
  const upiId = useStore(state => state.upiId);
  const bankAccount = useStore(state => state.bankAccount);
  const bankIfsc = useStore(state => state.bankIfsc);

  const deal = deals.find(d => d.id === dealId);

  if (!deal) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Invoice Not Found</h1>
        <p className="text-zinc-500 mb-6">Execution failed: The requested deal record could not be localized.</p>
        <button 
          onClick={() => router.back()}
          className="px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-zinc-200 transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const invoiceNumber = `INV-${deal.id.slice(0, 8).toUpperCase()}`;
  const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-zinc-100 print:bg-white text-black font-sans selection:bg-[#4CE3BC] selection:text-black antialiased">
      
      {/* Top Controls - Hidden on Print */}
      <nav className="sticky top-0 z-50 bg-[#0A0A0B] border-b border-white/5 py-4 px-6 print:hidden">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <div className="flex items-center gap-3">
             <button 
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-[#4CE3BC] text-black rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-white transition-all shadow-lg shadow-[#4CE3BC]/20"
             >
                <Printer size={14} /> Print / PDF
             </button>
             <button className="p-2 border border-white/10 text-white rounded-lg hover:bg-white/5 transition-colors">
                <Share2 size={16} />
             </button>
          </div>
        </div>
      </nav>

      <main className="py-12 md:py-20 px-6 print:py-0 print:px-0">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden border border-zinc-200 print:shadow-none print:border-none print:rounded-none"
        >
          {/* Invoice Header */}
          <div className="p-10 md:p-16 border-b border-zinc-100">
             <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
                <div>
                   <div className="flex items-center gap-2 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center font-black text-white text-lg">C</div>
                      <span className="text-xl font-black tracking-tighter uppercase italic">CreBoard OS</span>
                   </div>
                   <h1 className="text-sm font-black text-zinc-400 uppercase tracking-[0.4em] mb-1">Tax Invoice</h1>
                   <div className="text-2xl font-bold">{invoiceNumber}</div>
                </div>
                <div className="text-right">
                   <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Issue Date</p>
                   <p className="text-lg font-bold">{date}</p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                   <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-100 pb-2">From (Service Provider)</p>
                   <div>
                      <p className="text-lg font-black text-black">{userName || 'Creator Account'}</p>
                      <p className="text-sm text-zinc-600 whitespace-pre-line leading-relaxed mt-2">{billingAddress || 'No billing address provided in profile.'}</p>
                      {panGst && <p className="text-xs font-bold text-zinc-400 mt-4 uppercase">PAN / GST: <span className="text-black">{panGst}</span></p>}
                      <p className="text-xs font-bold text-zinc-400 mt-1 uppercase">Email: <span className="text-black">{userEmail}</span></p>
                   </div>
                </div>
                <div className="space-y-4 md:text-right">
                   <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-100 pb-2">Bill To (Brand Client)</p>
                   <div>
                      <p className="text-lg font-black text-black">{deal.brand}</p>
                      <p className="text-sm text-zinc-600 mt-2 italic">Campaign Identification: {deal.id.slice(0, 8)}</p>
                      <p className="text-xs font-bold text-zinc-400 mt-4 uppercase">Deliverable Target: <span className="text-black">{deal.platform} Platform</span></p>
                   </div>
                </div>
             </div>
          </div>

          {/* Line Items */}
          <div className="p-10 md:p-16">
             <table className="w-full text-left">
                <thead className="border-b-2 border-black">
                   <tr>
                      <th className="py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Description</th>
                      <th className="py-4 text-right text-[10px] font-black uppercase tracking-widest text-zinc-400">Unit Price</th>
                      <th className="py-4 text-right text-[10px] font-black uppercase tracking-widest text-zinc-400 md:w-32">Amount</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                   <tr>
                      <td className="py-8">
                         <p className="text-base font-bold text-black">{deal.deliverable}</p>
                         <p className="text-xs text-zinc-500 mt-1">Creator Content Deployment • Platform: {deal.platform}</p>
                      </td>
                      <td className="py-8 text-right text-sm font-bold text-zinc-600">₹{deal.value.toLocaleString()}</td>
                      <td className="py-8 text-right text-base font-black text-black">₹{deal.value.toLocaleString()}</td>
                   </tr>
                </tbody>
             </table>

             <div className="flex flex-col items-end gap-4 mt-12 py-8 border-t-2 border-zinc-100">
                <div className="flex justify-between w-64 text-sm font-bold">
                   <span className="text-zinc-400 uppercase tracking-widest">Subtotal</span>
                   <span>₹{deal.value.toLocaleString()}</span>
                </div>
                <div className="flex justify-between w-64 text-sm font-bold">
                   <span className="text-zinc-400 uppercase tracking-widest">Tax (0%)</span>
                   <span>₹0</span>
                </div>
                <div className="flex justify-between w-64 pt-4 mt-4 border-t-2 border-black">
                   <span className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400">Total Amount</span>
                   <span className="text-2xl font-black text-black">₹{deal.value.toLocaleString()}</span>
                </div>
             </div>
          </div>

          {/* Payment & Footer */}
          <div className="p-10 md:p-16 bg-zinc-50 min-h-[200px]">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                   <div>
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">Payment Destinations</p>
                      <div className="space-y-4">
                         {upiId && (
                           <div className="flex items-center gap-3 p-4 bg-white border border-zinc-200 rounded-2xl">
                              <div className="p-2 bg-[#4CE3BC]/10 text-black rounded-lg">
                                 <IndianRupee size={16} />
                              </div>
                              <div>
                                 <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-0.5">UPI ID</p>
                                 <p className="text-sm font-black">{upiId}</p>
                              </div>
                           </div>
                         )}
                         {(bankAccount && bankIfsc) && (
                           <div className="flex items-center gap-3 p-4 bg-white border border-zinc-200 rounded-2xl">
                              <div className="p-2 bg-zinc-100 text-black rounded-lg">
                                 <Globe size={16} />
                              </div>
                              <div>
                                 <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-0.5">Bank Transfer</p>
                                 <p className="text-sm font-black">{bankAccount}</p>
                                 <p className="text-[9px] font-bold text-zinc-400 mt-0.5 uppercase">IFSC: {bankIfsc}</p>
                              </div>
                           </div>
                         )}
                      </div>
                   </div>
                </div>
                <div className="md:text-right flex flex-col justify-between">
                   <div className="p-6 border border-zinc-200 rounded-3xl bg-white/50 text-center md:text-right">
                      <CheckCircle2 className="text-success-text mb-2 ml-auto" size={24} />
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Terms</p>
                      <p className="text-xs font-bold text-black leading-relaxed">Payment due upon brand approval of final deliverable. Late payments may incur standard protocol penalties.</p>
                   </div>
                   <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.4em] mt-12">Authorized by {userName || 'Creator'}</p>
                </div>
             </div>
          </div>
        </motion.div>

        <footer className="mt-12 text-center text-zinc-400 text-[10px] font-bold uppercase tracking-[0.5em] print:hidden">
          Generated via CreBoard Creative Protocol
        </footer>
      </main>
    </div>
  );
}
