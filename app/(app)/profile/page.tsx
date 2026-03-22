'use client';
import { useStore } from '@/src/store';
import { User, Mail, Shield, BarChart3, Layers, IndianRupee, Bell, ExternalLink } from 'lucide-react';

export default function ProfilePage() {
  const deals = useStore(state => state.deals);
  const revenue = useStore(state => state.revenue);
  const userEmail = useStore(state => state.userEmail) || "User Account";

  const totalRevenue = revenue.reduce((sum, r) => sum + r.amount, 0);
  const activeDeals = deals.filter(d => !d.isCompleted).length;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Account Profile</h1>
        <p className="text-sm text-foreground-muted">Manage your personal settings and overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-card border border-border p-6 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-500">
               <User size={120} />
            </div>
            
            <div className="flex items-center gap-6 mb-8 relative">
              <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary border-2 border-primary/20">
                <User size={40} />
              </div>
              <div>
                <h2 className="text-xl font-black text-foreground mb-1">Creator Account</h2>
                <div className="flex items-center gap-2 text-sm text-foreground-muted bg-foreground/5 px-3 py-1 rounded-full w-fit">
                  <Mail size={12} />
                  <span>{userEmail}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 relative">
              <div className="p-4 bg-foreground/5 rounded-2xl">
                <p className="text-[10px] font-bold text-foreground-subtle uppercase tracking-widest mb-1">Verified Status</p>
                <div className="flex items-center gap-2 text-sm font-bold text-success-text">
                  <Shield size={16} /> Partner
                </div>
              </div>
              <div className="p-4 bg-foreground/5 rounded-2xl">
                <p className="text-[10px] font-bold text-foreground-subtle uppercase tracking-widest mb-1">Member Since</p>
                <div className="text-sm font-bold text-foreground">March 2024</div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border p-6 rounded-3xl space-y-6">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
               <Bell size={16} className="text-primary"/> Notifications
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-2 hover:bg-foreground/5 rounded-xl transition-colors">
                 <div>
                   <p className="text-sm font-bold text-foreground">Email Alerts</p>
                   <p className="text-xs text-foreground-muted">Receive summaries of overdue payments</p>
                 </div>
                 <div className="w-10 h-5 bg-primary rounded-full relative">
                    <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                 </div>
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-foreground/5 rounded-xl transition-colors">
                 <div>
                   <p className="text-sm font-bold text-foreground">Weekly Reports</p>
                   <p className="text-xs text-foreground-muted">Get a PDF of your revenue performance</p>
                 </div>
                 <div className="w-10 h-5 bg-foreground/20 rounded-full relative">
                    <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full" />
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-4">
          <div className="bg-card border border-border p-5 rounded-3xl text-center">
            <div className="p-3 bg-success-bg/10 text-success-text rounded-2xl w-fit mx-auto mb-3">
               <IndianRupee size={24} />
            </div>
            <p className="text-[10px] font-bold text-foreground-subtle uppercase tracking-widest mb-1">Lifetime Revenue</p>
            <p className="text-2xl font-black text-foreground">₹{totalRevenue.toLocaleString()}</p>
          </div>

          <div className="bg-card border border-border p-5 rounded-3xl text-center">
            <div className="p-3 bg-primary/10 text-primary rounded-2xl w-fit mx-auto mb-3">
               <Layers size={24} />
            </div>
            <p className="text-[10px] font-bold text-foreground-subtle uppercase tracking-widest mb-1">Active Deals</p>
            <p className="text-2xl font-black text-foreground">{activeDeals}</p>
          </div>

          <a 
            href="mailto:creboard.support@gmail.com"
            className="w-full py-4 bg-foreground text-background font-bold rounded-2xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            Support Center <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
