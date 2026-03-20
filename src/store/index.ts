import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export type Deal = {
  id: string; brand: string; platform: string; deliverable: string; value: number; deadline: string; stage: string;
  isDueSoon?: boolean; isOverdue?: boolean; isCompleted?: boolean;
};

export type Payment = {
  id: string; dealName: string; brand: string; platform: string; amount: number; dueDate: string; receivedDate: string | null; status: string;
  dealId?: string;
};

export type ContentTask = {
  id: string; title: string; platform: string; type: string; status: 'Idea' | 'In Progress' | 'Ready' | 'Posted'; dueDate: string;
};

export type BrandProfile = {
  id: string; name: string; contactPerson: string; platform: string; industry: string; rating: number;
  notes: { id: string; text: string; date: string }[];
};

export type Contract = {
  id: string; dealId: string; brand: string; dealName: string; value: number;
  status: 'Draft' | 'Sent' | 'Signed' | 'Completed';
  deadline: string;
  deliverables: string[];
  paymentTerms: string;
  keyTerms: { timeline: string; penalties: string; revisions: string; exclusivity: string; };
  notes: { id: string; text: string; date: string }[];
};

export type RevenueRecord = {
  id: string; date: string; platform: string; type: string; amount: number; notes: string; source?: string; payment_id?: string;
};

interface AppState {
  isInitialized: boolean;
  deals: Deal[];
  payments: Payment[];
  revenue: RevenueRecord[];
  contracts: Contract[];
  contentTasks: ContentTask[];
  brands: BrandProfile[];

  initializeStore: () => Promise<void>;

  addBrand: (brand: BrandProfile) => void;
  updateBrand: (id: string, updates: Partial<BrandProfile>) => void;
  addContentTask: (task: ContentTask) => void;
  updateContentTaskStatus: (id: string, status: 'Idea' | 'In Progress' | 'Ready' | 'Posted') => void;
  
  addDeal: (deal: Deal) => void;
  updateDealStage: (id: string, stage: string) => void;
  addRevenue: (record: RevenueRecord) => void;
  markPaymentReceived: (id: string, date: string) => void;

  deleteDeal: (id: string) => Promise<void>;
  deletePayment: (id: string) => Promise<void>;
  deleteRevenue: (id: string) => Promise<void>;
  deleteBrand: (id: string) => void;
}

export const useStore = create<AppState>((set, get) => ({
  isInitialized: false,
  deals: [],
  payments: [],
  revenue: [],
  brands: [],
  contracts: [],
  contentTasks: [],

  initializeStore: async () => {
    if (get().isInitialized) return;

    try {
      const [dealsRes, paymentsRes, revenueRes, brandsRes] = await Promise.all([
        supabase.from('deals').select('*').order('deadline', { ascending: true }),
        supabase.from('payments').select('*').order('due_date', { ascending: true }),
        supabase.from('revenue').select('*').order('date', { ascending: false }),
        supabase.from('brands').select('*').order('name', { ascending: true })
      ]);

      const fetchedDeals: Deal[] = (dealsRes.data || []).map(d => ({
        id: d.id,
        brand: d.brand,
        platform: d.platform || 'Unknown',
        deliverable: d.deliverable || 'Unknown',
        value: d.value,
        stage: d.status,
        deadline: d.deadline,
        isCompleted: d.is_completed
      }));

      const fetchedPayments: Payment[] = (paymentsRes.data || []).map(p => {
        const parentDeal = fetchedDeals.find(d => d.id === p.deal_id);
        return {
          id: p.id,
          dealId: p.deal_id,
          dealName: parentDeal?.deliverable || 'Unknown Deal',
          brand: parentDeal?.brand || 'Unknown',
          platform: parentDeal?.platform || 'Unknown',
          amount: p.amount,
          status: p.status,
          dueDate: p.due_date,
          receivedDate: p.received_date
        };
      });

      const fetchedRevenue: RevenueRecord[] = (revenueRes.data || []).map(r => ({
        id: r.id,
        date: r.date,
        platform: r.platform || 'Unknown',
        type: r.type || 'Sponsorship',
        amount: r.amount,
        notes: r.notes || '',
        source: r.source,
        payment_id: r.payment_id
      }));

      const fetchedBrands: BrandProfile[] = (brandsRes.data || []).map(b => ({
        id: b.id,
        name: b.name,
        contactPerson: b.contact_person || 'Unknown',
        platform: b.platform || 'Other',
        industry: b.industry || 'Other',
        rating: b.rating || 3,
        notes: b.notes || []
      }));

      set({
        deals: fetchedDeals,
        payments: fetchedPayments,
        revenue: fetchedRevenue,
        brands: fetchedBrands,
        isInitialized: true
      });
    } catch (error) {
      console.error('Failed to fetch from Supabase:', error);
    }
  },
  
  addBrand: async (brand) => {
    const safeBrand = { ...brand, id: brand.id.includes('_') || brand.id.length < 32 ? crypto.randomUUID() : brand.id };
    
    set((state) => ({ brands: [...state.brands, safeBrand] }));
    
    await supabase.from('brands').insert([{
      id: safeBrand.id,
      name: safeBrand.name,
      contact_person: safeBrand.contactPerson,
      platform: safeBrand.platform,
      industry: safeBrand.industry,
      rating: safeBrand.rating,
      notes: safeBrand.notes
    }]);
  },

  updateBrand: async (id, updates) => {
    set((state) => ({ brands: state.brands.map(b => b.id === id ? { ...b, ...updates } : b) }));
    
    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.contactPerson !== undefined) dbUpdates.contact_person = updates.contactPerson;
    if (updates.platform !== undefined) dbUpdates.platform = updates.platform;
    if (updates.industry !== undefined) dbUpdates.industry = updates.industry;
    if (updates.rating !== undefined) dbUpdates.rating = updates.rating;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes;

    if (Object.keys(dbUpdates).length > 0) {
      await supabase.from('brands').update(dbUpdates).eq('id', id);
    }
  },
  addContentTask: (task) => set((state) => ({ contentTasks: [...state.contentTasks, task] })),
  updateContentTaskStatus: (id, status) => set((state) => ({ contentTasks: state.contentTasks.map(t => t.id === id ? { ...t, status } : t) })),

  addDeal: async (deal) => {
    // Generate true UUIDv4 if UI didn't provide one
    const safeId = deal.id.includes('_') || deal.id.length < 32 ? crypto.randomUUID() : deal.id;
    const safeDeal = { ...deal, id: safeId };

    set((state) => ({ deals: [...state.deals, safeDeal] }));

    const brandExists = get().brands.some(b => b.name.toLowerCase() === safeDeal.brand.toLowerCase());
    if (!brandExists) {
        get().addBrand({
            id: crypto.randomUUID(),
            name: safeDeal.brand,
            contactPerson: 'Unknown',
            platform: safeDeal.platform,
            industry: 'Other',
            rating: 3,
            notes: []
        });
    }
    
    const { error } = await supabase.from('deals').insert([{
      id: safeId,
      brand: safeDeal.brand,
      value: safeDeal.value,
      status: safeDeal.stage,
      deadline: safeDeal.deadline,
      platform: safeDeal.platform,
      deliverable: safeDeal.deliverable,
      is_completed: safeDeal.isCompleted || false
    }]);

    if (error) console.error('Error inserting deal:', error);
  },
  
  updateDealStage: async (id, stage) => {
    const originalDeals = get().deals;
    const isCompleted = stage === 'Paid' || stage === 'Delivered';

    set((state) => ({
      deals: state.deals.map(d => d.id === id ? { ...d, stage, isCompleted } : d)
    }));
    
    await supabase.from('deals').update({ status: stage, is_completed: isCompleted }).eq('id', id);

    const dealThatMoved = get().deals.find(d => d.id === id);
    if (!dealThatMoved) return;

    if (stage === 'Paid' || stage === 'Delivered') {
       const existingPayment = get().payments.find(p => p.dealId === id);
       const today = new Date().toISOString().split('T')[0];
       let newPaymentId = crypto.randomUUID();

       const paymentStatus = stage === 'Paid' ? 'Paid' : 'Pending';
       const rcvDate = stage === 'Paid' ? today : null;

       if (existingPayment) {
          newPaymentId = existingPayment.id;
          set(state => ({
            payments: state.payments.map(p => p.id === existingPayment.id ? { ...p, status: paymentStatus, receivedDate: rcvDate } : p)
          }));
          await supabase.from('payments').update({ status: paymentStatus, received_date: rcvDate }).eq('id', newPaymentId);
       } else {
          const newPayment = {
            id: newPaymentId,
            deal_id: dealThatMoved.id,
            amount: dealThatMoved.value,
            status: paymentStatus,
            due_date: dealThatMoved.deadline,
            received_date: rcvDate
          };
          
          set((state) => ({
            payments: [{
              id: newPaymentId,
              dealId: dealThatMoved.id,
              dealName: dealThatMoved.deliverable,
              brand: dealThatMoved.brand,
              platform: dealThatMoved.platform,
              amount: dealThatMoved.value,
              status: paymentStatus,
              dueDate: dealThatMoved.deadline,
              receivedDate: rcvDate
            }, ...state.payments]
          }));

          await supabase.from('payments').insert([newPayment]);
       }

       if (newPaymentId && stage === 'Paid') {
         const alreadyHasRevenue = get().revenue.some(r => r.payment_id === newPaymentId);
         if (!alreadyHasRevenue) {
           const revId = crypto.randomUUID();
           const newRev = {
             id: revId,
             source: 'deal',
             payment_id: newPaymentId,
             platform: dealThatMoved.platform,
             type: 'Sponsorship',
             amount: dealThatMoved.value,
             date: today,
             notes: `Auto-generated from Deal: ${dealThatMoved.brand}`
           };

           set(state => ({
             revenue: [{
               id: revId,
               date: today,
               platform: dealThatMoved.platform,
               type: 'Sponsorship',
               amount: dealThatMoved.value,
               notes: newRev.notes,
               source: 'deal',
               payment_id: newPaymentId
             }, ...state.revenue]
           }));

           await supabase.from('revenue').insert([newRev]);
         }
       }
    }

    const originalDeal = originalDeals.find(d => d.id === id);
    if (stage !== 'Paid' && stage !== 'Delivered' && originalDeal?.isCompleted) {
        const existingPayment = get().payments.find(p => p.dealId === id);
        if (existingPayment) {
            set(state => ({
              payments: state.payments.map(p => p.id === existingPayment.id ? { ...p, status: 'Pending', receivedDate: null } : p),
              revenue: state.revenue.filter(r => r.payment_id !== existingPayment.id)
            }));

            await supabase.from('payments').update({ status: 'Pending', received_date: null }).eq('id', existingPayment.id);
            await supabase.from('revenue').delete().eq('payment_id', existingPayment.id);
        }
    }
  },

  addRevenue: async (record) => {
    const safeId = record.id.includes('_') || record.id.length < 32 ? crypto.randomUUID() : record.id;
    const safeRecord = { ...record, id: safeId };

    set((state) => ({ revenue: [safeRecord, ...state.revenue] }));
    await supabase.from('revenue').insert([{
      id: safeId,
      date: safeRecord.date,
      platform: safeRecord.platform,
      type: safeRecord.type,
      amount: safeRecord.amount,
      notes: safeRecord.notes,
      source: safeRecord.source || 'other'
    }]);
  },

  markPaymentReceived: async (id, date) => {
     const payment = get().payments.find(p => p.id === id);
     if (!payment) return;

     const alreadyHasRevenue = get().revenue.some(r => r.payment_id === id);
     
     set(state => ({
        payments: state.payments.map(p => p.id === id ? { ...p, status: 'Paid', receivedDate: date } : p)
     }));
     await supabase.from('payments').update({ status: 'Paid', received_date: date }).eq('id', id);

     if (!alreadyHasRevenue) {
        const revId = crypto.randomUUID();
        const newRevInsert = {
            id: revId,
            date,
            platform: payment.platform,
            type: 'Sponsorship',
            amount: payment.amount,
            notes: `Auto-generated from Payment: ${payment.brand} - ${payment.dealName}`,
            source: 'deal',
            payment_id: id
        };

        set(state => ({
          revenue: [{
            id: revId,
            date,
            platform: payment.platform,
            type: 'Sponsorship',
            amount: payment.amount,
            notes: newRevInsert.notes,
            source: 'deal',
            payment_id: id
          }, ...state.revenue]
        }));

        await supabase.from('revenue').insert([newRevInsert]);
     }

     if (payment.dealId) {
        set(state => ({
           deals: state.deals.map(d => d.id === payment.dealId ? { ...d, stage: 'Paid', isCompleted: true } : d)
        }));
        await supabase.from('deals').update({ status: 'Paid', is_completed: true }).eq('id', payment.dealId);
     }
  },

  deleteDeal: async (id) => {
    const payment = get().payments.find(p => p.dealId === id);
    const paymentId = payment?.id;

    set(state => ({
      deals: state.deals.filter(d => d.id !== id),
      payments: state.payments.filter(p => p.dealId !== id),
      revenue: state.revenue.filter(r => r.payment_id !== paymentId)
    }));

    if (paymentId) {
      await supabase.from('revenue').delete().eq('payment_id', paymentId);
      await supabase.from('payments').delete().eq('deal_id', id);
    }
    await supabase.from('deals').delete().eq('id', id);
  },

  deletePayment: async (id) => {
    set(state => ({
      payments: state.payments.filter(p => p.id !== id),
      revenue: state.revenue.filter(r => r.payment_id !== id)
    }));
    await supabase.from('revenue').delete().eq('payment_id', id);
    await supabase.from('payments').delete().eq('id', id);
  },

  deleteRevenue: async (id) => {
    set(state => ({ revenue: state.revenue.filter(r => r.id !== id) }));
    await supabase.from('revenue').delete().eq('id', id);
  },

  deleteBrand: async (id) => {
    set(state => ({ brands: state.brands.filter(b => b.id !== id) }));
    await supabase.from('brands').delete().eq('id', id);
  }
}));
