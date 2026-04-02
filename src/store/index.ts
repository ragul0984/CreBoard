import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createClient } from '@/src/utils/supabase/client';

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
  isInitializing: boolean;
  deals: Deal[];
  payments: Payment[];
  revenue: RevenueRecord[];
  contracts: Contract[];
  contentTasks: ContentTask[];
  brands: BrandProfile[];
  userId: string | null;
  userEmail: string | null;
  userName: string | null;
  isOnboarded: boolean | undefined;
  
  // Professional Details
  billingAddress: string;
  panGst: string;
  upiId: string;
  bankAccount: string;
  bankIfsc: string;
  paymentTerms: number;

  initializeStore: () => Promise<void>;
  clearStore: () => void;

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
  updateProfile: (updates: { 
    full_name?: string; 
    gender?: string; 
    dob?: string; 
    billing_address?: string; 
    pan_gst?: string; 
    upi_id?: string; 
    bank_account?: string; 
    bank_ifsc?: string;
    payment_terms?: number;
  }) => Promise<void>;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
  isInitialized: false,
  isInitializing: false,
  userId: null,
  userEmail: null,
  userName: null,
  isOnboarded: undefined,

  deals: [],
  payments: [],
  revenue: [],
  brands: [],
  contracts: [],
  contentTasks: [],

  billingAddress: '',
  panGst: '',
  upiId: '',
  bankAccount: '',
  bankIfsc: '',
  paymentTerms: 30,

  initializeStore: async () => {
    if (get().isInitializing) {
      console.log('⏳ Store initialization already in progress, skipping call.');
      return;
    }

    const hasCachedData = get().deals.length > 0 || get().brands.length > 0;
    
    if (!hasCachedData) {
      set({ isInitializing: true });
    }
    
    console.log(`📦 Calling initializeStore... (Silent Hydration: ${hasCachedData})`);
    const supabase = createClient();
    
    try {
      console.log('📡 Fetching user session...');
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.warn('❌ Auth check failed in store:', userError || 'No user found');
        return;
      }

      if (get().isInitialized && get().userId === user.id) {
        console.log('✅ Store already initialized for current user, skipping.');
        return;
      }

      console.log('👤 Initializing store for:', user.email);

      const [dealsRes, paymentsRes, revenueRes, brandsRes, tasksRes, profileRes] = await Promise.all([
        supabase.from('deals').select('*').order('deadline', { ascending: true }),
        supabase.from('payments').select('*').order('due_date', { ascending: true }),
        supabase.from('revenue').select('*').order('date', { ascending: false }),
        supabase.from('brands').select('*').order('name', { ascending: true }),
        supabase.from('content_tasks').select('*').order('due_date', { ascending: true }),
        supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
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
        notes: Array.isArray(b.notes) ? b.notes : []
      }));

      const fetchedTasks: ContentTask[] = (tasksRes.data || []).map(t => ({
        id: t.id,
        title: t.title,
        platform: t.platform || 'Other',
        type: t.type || 'Other',
        status: t.status as any,
        due_date: t.due_date,
        dueDate: t.due_date // syncing camelCase
      }));

      set({
        deals: fetchedDeals,
        payments: fetchedPayments,
        revenue: fetchedRevenue,
        brands: fetchedBrands,
        contentTasks: fetchedTasks,
        userId: user.id,
        userEmail: user.email || null,
        userName: profileRes.data?.full_name || null,
        isOnboarded: profileRes.data?.is_onboarded || false,
        isInitialized: true,
        // Pro Fields
        billingAddress: profileRes.data?.billing_address || '',
        panGst: profileRes.data?.pan_gst || '',
        upiId: profileRes.data?.upi_id || '',
        bankAccount: profileRes.data?.bank_account || '',
        bankIfsc: profileRes.data?.bank_ifsc || '',
        paymentTerms: profileRes.data?.payment_terms || 30
      });
      console.log('Store initialized with data from Supabase');
    } catch (error) {
      console.error('Failed to initialize store:', error);
    } finally {
      set({ isInitializing: false });
    }
  },

  clearStore: () => {
    set({
      isInitialized: false,
      deals: [],
      payments: [],
      revenue: [],
      brands: [],
      contracts: [],
      contentTasks: [],
      userId: null,
      userEmail: null,
      userName: null,
      isOnboarded: undefined
    });
    console.log('🧹 Store cleared');
  },
  
  addBrand: async (brand) => {
    const supabase = createClient();
    const existing = get().brands.find(b => b.name.toLowerCase() === brand.name.toLowerCase());
    if (existing) {
       console.log(`🏷️ Brand ${brand.name} already exists, skipping creation.`);
       return;
    }

    const safeBrand = { ...brand, id: brand.id.includes('_') || brand.id.length < 32 ? crypto.randomUUID() : brand.id };
    set((state) => ({ brands: [...state.brands, safeBrand] }));
    
    await supabase.from('brands').insert([{
      id: safeBrand.id,
      user_id: get().userId,
      name: safeBrand.name,
      contact_person: safeBrand.contactPerson,
      platform: safeBrand.platform,
      industry: safeBrand.industry,
      rating: safeBrand.rating,
      notes: safeBrand.notes
    }]);
  },

  updateBrand: async (id, updates) => {
    const supabase = createClient();
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
  addContentTask: async (task) => {
    const supabase = createClient();
    const safeId = crypto.randomUUID();
    const safeTask = { ...task, id: safeId };
    
    set((state) => ({ contentTasks: [...state.contentTasks, safeTask] }));
    
    await supabase.from('content_tasks').insert([{
      id: safeId,
      user_id: get().userId,
      title: safeTask.title,
      platform: safeTask.platform,
      type: safeTask.type,
      status: safeTask.status,
      due_date: safeTask.dueDate
    }]);
  },
  updateContentTaskStatus: async (id, status) => {
    const supabase = createClient();
    set((state) => ({ contentTasks: state.contentTasks.map(t => t.id === id ? { ...t, status } : t) }));
    await supabase.from('content_tasks').update({ status }).eq('id', id);
  },

  addDeal: async (deal) => {
    const supabase = createClient();
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
      user_id: get().userId,
      brand: safeDeal.brand,
      value: safeDeal.value,
      status: safeDeal.stage,
      deadline: safeDeal.deadline,
      platform: safeDeal.platform,
      deliverable: safeDeal.deliverable,
      is_completed: safeDeal.isCompleted || false
    }]);

    if (error) {
       console.error('❌ Error inserting deal:', error);
       alert(`Database Error: ${error.message} (${error.code})`);
    } else {
       console.log('✅ Deal saved to Supabase');
    }
  },
  
  updateDealStage: async (id, stage) => {
    const supabase = createClient();
    const originalDeals = get().deals;
    const isCompleted = stage === 'Paid' || stage === 'Delivered';

    set((state) => ({
      deals: state.deals.map(d => d.id === id ? { ...d, stage, isCompleted } : d)
    }));
    
    await supabase.from('deals').update({ status: stage, is_completed: isCompleted }).eq('id', id);

    const dealThatMoved = get().deals.find(d => d.id === id);
    if (!dealThatMoved) return;

    const toLocalDate = (date: Date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };

    const today = toLocalDate(new Date());
    const existingPayment = get().payments.find(p => p.dealId === id);

    // LOGIC: If PAID -> Generate/Update Payment and Revenue
    if (stage === 'Paid') {
       let paymentId = existingPayment?.id || crypto.randomUUID();
       
       if (existingPayment) {
          set(state => ({
            payments: state.payments.map(p => p.id === paymentId ? { ...p, status: 'Paid', receivedDate: today } : p)
          }));
          await supabase.from('payments').update({ status: 'Paid', received_date: today }).eq('id', paymentId);
       } else {
          set(state => ({
            payments: [{
                id: paymentId, dealId: dealThatMoved.id, dealName: dealThatMoved.deliverable,
                brand: dealThatMoved.brand, platform: dealThatMoved.platform,
                amount: dealThatMoved.value, status: 'Paid', dueDate: dealThatMoved.deadline, receivedDate: today
            }, ...state.payments]
          }));
          await supabase.from('payments').insert([{
            id: paymentId,
            user_id: get().userId,
            deal_id: dealThatMoved.id,
            amount: dealThatMoved.value,
            status: 'Paid',
            due_date: dealThatMoved.deadline,
            received_date: today
          }]);
       }

       // Ensure Revenue exists
       const alreadyHasRevenue = get().revenue.some(r => r.payment_id === paymentId);
       if (!alreadyHasRevenue) {
          const revId = crypto.randomUUID();
          const newRev = {
             id: revId, user_id: get().userId, source: 'deal', payment_id: paymentId,
             platform: dealThatMoved.platform, type: 'Sponsorship',
             amount: dealThatMoved.value, date: today, notes: `Deal: ${dealThatMoved.brand}`
          };
          set(state => ({ revenue: [newRev, ...state.revenue] }));
          await supabase.from('revenue').insert([newRev]);
       }
    } 
    // LOGIC: If DELIVERED -> Ensure Payment exists (Pending) but REMOVE Revenue
    else if (stage === 'Delivered') {
      const terms = get().paymentTerms || 30;
      const todayDate = new Date();
      todayDate.setDate(todayDate.getDate() + terms);
      const calculatedDueDate = toLocalDate(todayDate);

      if (existingPayment) {
        set(state => ({
          payments: state.payments.map(p => p.id === existingPayment.id ? { ...p, status: 'Pending', receivedDate: null, dueDate: calculatedDueDate } : p),
          revenue: state.revenue.filter(r => r.payment_id !== existingPayment.id)
        }));
        await supabase.from('payments').update({ status: 'Pending', received_date: null, due_date: calculatedDueDate }).eq('id', existingPayment.id);
        await supabase.from('revenue').delete().eq('payment_id', existingPayment.id);
      } else {
        const pId = crypto.randomUUID();
        set(state => ({
          payments: [{
            id: pId, dealId: dealThatMoved.id, dealName: dealThatMoved.deliverable,
            brand: dealThatMoved.brand, platform: dealThatMoved.platform,
            amount: dealThatMoved.value, status: 'Pending', dueDate: calculatedDueDate, receivedDate: null
          }, ...state.payments]
        }));
        await supabase.from('payments').insert([{
          id: pId, user_id: get().userId, deal_id: dealThatMoved.id, amount: dealThatMoved.value,
          status: 'Pending', due_date: calculatedDueDate, received_date: null
        }]);
      }
    }
    // LOGIC: Anything else (To-do, Doing, Ready, Lost) -> Cleanup financial records
    else {
       if (existingPayment) {
          set(state => ({
            payments: state.payments.filter(p => p.id !== existingPayment.id),
            revenue: state.revenue.filter(r => r.payment_id !== existingPayment.id)
          }));
          await supabase.from('revenue').delete().eq('payment_id', existingPayment.id);
          await supabase.from('payments').delete().eq('id', existingPayment.id);
          console.log(`🧹 Cleaned up financial records for deal moved back to ${stage}`);
       }
    }
  },

  addRevenue: async (record) => {
    const supabase = createClient();
    const safeId = record.id.includes('_') || record.id.length < 32 ? crypto.randomUUID() : record.id;
    const safeRecord = { ...record, id: safeId };

    set((state) => ({ revenue: [safeRecord, ...state.revenue] }));
    await supabase.from('revenue').insert([{
      id: safeId,
      user_id: get().userId,
      date: safeRecord.date,
      platform: safeRecord.platform,
      type: safeRecord.type,
      amount: safeRecord.amount,
      notes: safeRecord.notes,
      source: safeRecord.source || 'other'
    }]);
  },

  markPaymentReceived: async (id, date) => {
     const supabase = createClient();
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
    const supabase = createClient();
    const payment = get().payments.find(p => p.dealId === id);
    const paymentId = payment?.id;

    set(state => ({
      deals: state.deals.filter(d => d.id !== id),
      payments: state.payments.filter(p => p.dealId !== id),
      revenue: state.revenue.filter(r => r.payment_id !== paymentId)
    }));

    await supabase.from('revenue').delete().eq('payment_id', paymentId);
    await supabase.from('payments').delete().eq('deal_id', id);
    await supabase.from('deals').delete().eq('id', id);
  },

  deletePayment: async (id) => {
    const supabase = createClient();
    set(state => ({
      payments: state.payments.filter(p => p.id !== id),
      revenue: state.revenue.filter(r => r.payment_id !== id)
    }));
    await supabase.from('revenue').delete().eq('payment_id', id);
    await supabase.from('payments').delete().eq('id', id);
  },

  deleteRevenue: async (id) => {
    const supabase = createClient();
    set(state => ({ revenue: state.revenue.filter(r => r.id !== id) }));
    await supabase.from('revenue').delete().eq('id', id);
  },

  deleteBrand: async (id) => {
    const supabase = createClient();
    set(state => ({ brands: state.brands.filter(b => b.id !== id) }));
    await supabase.from('brands').delete().eq('id', id);
  },
  
  updateProfile: async (updates) => {
    const supabase = createClient();
    const userId = get().userId;
    if (!userId) return;

    const dbUpdates: any = { updated_at: new Date() };
    if (updates.full_name !== undefined) dbUpdates.full_name = updates.full_name;
    if (updates.gender !== undefined) dbUpdates.gender = updates.gender;
    if (updates.dob !== undefined) dbUpdates.dob = updates.dob;
    if (updates.billing_address !== undefined) dbUpdates.billing_address = updates.billing_address;
    if (updates.pan_gst !== undefined) dbUpdates.pan_gst = updates.pan_gst;
    if (updates.upi_id !== undefined) dbUpdates.upi_id = updates.upi_id;
    if (updates.bank_account !== undefined) dbUpdates.bank_account = updates.bank_account;
    if (updates.bank_ifsc !== undefined) dbUpdates.bank_ifsc = updates.bank_ifsc;

    set(state => ({
       userName: updates.full_name !== undefined ? updates.full_name : state.userName,
       billingAddress: updates.billing_address !== undefined ? updates.billing_address : state.billingAddress,
       panGst: updates.pan_gst !== undefined ? updates.pan_gst : state.panGst,
       upiId: updates.upi_id !== undefined ? updates.upi_id : state.upiId,
       bankAccount: updates.bank_account !== undefined ? updates.bank_account : state.bankAccount,
       bankIfsc: updates.bank_ifsc !== undefined ? updates.bank_ifsc : state.bankIfsc,
       paymentTerms: (updates as any).payment_terms !== undefined ? (updates as any).payment_terms : state.paymentTerms
    }));

    if ((updates as any).payment_terms !== undefined) dbUpdates.payment_terms = (updates as any).payment_terms;

    await supabase.from('profiles').update(dbUpdates).eq('id', userId);
  }
    }),
    {
      name: 'creboard-storage',
      partialize: (state) => ({
        deals: state.deals,
        payments: state.payments,
        revenue: state.revenue,
        brands: state.brands,
        contracts: state.contracts,
        contentTasks: state.contentTasks,
        billingAddress: state.billingAddress,
        panGst: state.panGst,
        upiId: state.upiId,
        bankAccount: state.bankAccount,
        bankIfsc: state.bankIfsc,
        paymentTerms: state.paymentTerms,
        userName: state.userName,
      })
    }
  )
);
