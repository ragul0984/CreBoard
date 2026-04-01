'use client';
import { useState, useEffect } from 'react';
import { useStore } from '@/src/store';
import { User, Mail, Shield, BarChart3, Layers, IndianRupee, Bell, ExternalLink, Send, Loader2, Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { createClient } from '@/src/utils/supabase/client';
import { useLoading } from '@/src/context/LoadingContext';

export default function ProfilePage() {
  const deals = useStore(state => state.deals);
  const revenue = useStore(state => state.revenue);
  const userName = useStore(state => state.userName);
  const userEmail = useStore(state => state.userEmail) || "User Account";

  const totalRevenue = revenue.reduce((sum, r) => sum + r.amount, 0);
  const activeDeals = deals.filter(d => !d.isCompleted).length;

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);
  const [isTestingEmail, setIsTestingEmail] = useState(false);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editGender, setEditGender] = useState('Prefer not to say');
  const [editDob, setEditDob] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const { startLoading, stopLoading } = useLoading();

  const supabase = createClient();
  const userId = useStore(state => state.userId);

  useEffect(() => {
    if (!userId) return;
    const fetchProfile = async () => {
      const { data } = await supabase.from('profiles').select('email_alerts, weekly_reports, full_name, gender, dob').eq('id', userId).maybeSingle();
      if (data) {
        setEmailAlerts(data.email_alerts ?? true);
        setWeeklyReports(data.weekly_reports ?? false);
        setEditName(data.full_name || '');
        setEditGender(data.gender || 'Prefer not to say');
        setEditDob(data.dob || '');
      }
    };
    fetchProfile();
  }, [userId, supabase]);

  const toggleAlerts = async () => {
    const nextVal = !emailAlerts;
    setEmailAlerts(nextVal);
    if (userId) await supabase.from('profiles').upsert({ id: userId, email_alerts: nextVal, updated_at: new Date() });
  };

  const toggleReports = async () => {
    const nextVal = !weeklyReports;
    setWeeklyReports(nextVal);
    if (userId) await supabase.from('profiles').upsert({ id: userId, weekly_reports: nextVal, updated_at: new Date() });
  };

  const saveProfile = async () => {
    startLoading();
    await useStore.getState().updateProfile({ 
      full_name: editName, 
      gender: editGender, 
      dob: editDob 
    });
    setIsEditingProfile(false);
    stopLoading();
  };

  const deleteAccount = async () => {
    const confirmText = window.prompt("Type 'DELETE' to permanently wipe your account and all data. This cannot be undone.");
    if (confirmText !== 'DELETE') return;
    
    setIsDeleting(true);
    startLoading();
    const { error } = await supabase.rpc('delete_user_account');
    
    if (error) {
      alert("Failed to delete account: " + error.message);
      setIsDeleting(false);
      stopLoading();
    } else {
      useStore.getState().clearStore();
      await supabase.auth.signOut();
      window.location.href = '/login';
    }
  };

  const changePassword = async () => {
    if (!newPassword || !confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Please fill out both fields.' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    setIsChangingPassword(true);
    startLoading();
    setPasswordMessage(null);

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setPasswordMessage({ type: 'error', text: error.message });
    } else {
      setPasswordMessage({ type: 'success', text: 'Password updated successfully!' });
      setNewPassword('');
      setConfirmPassword('');
    }
    setIsChangingPassword(false);
    stopLoading();
  };

  const testEmail = async () => {
    if (!weeklyReports) {
      alert("Please enable Weekly Reports first to test the dispatch!");
      return;
    }
    setIsTestingEmail(true);
    try {
      const res = await fetch('/api/email/weekly', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert("Success! The Weekly Report has been dispatched to your inbox.");
      } else {
        alert("Dispatch Error: " + (data.message || data.error));
      }
    } catch (err) {
      alert("Network Error: Failed to hit the email API dispatch route.");
    } finally {
      setIsTestingEmail(false);
    }
  };

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
                <h2 className="text-xl font-black text-foreground mb-1">{userName || 'Creator Account'}</h2>
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

          {/* Identity Settings */}
          <div className="bg-card border border-border p-6 rounded-3xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
                <User size={16} className="text-primary"/> Personal Information
              </h3>
              {!isEditingProfile ? (
                <button onClick={() => setIsEditingProfile(true)} className="text-xs font-bold text-primary hover:text-white uppercase tracking-widest transition-colors bg-primary/10 px-3 py-1 rounded-full">Edit</button>
              ) : (
                <button onClick={saveProfile} className="text-xs font-bold text-success-text hover:text-white uppercase tracking-widest transition-colors bg-success-text/10 px-3 py-1 rounded-full">Save Changes</button>
              )}
            </div>

            {!isEditingProfile ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-foreground-subtle uppercase tracking-widest mb-1 block">Full Name</label>
                  <p className="text-sm font-bold text-white">{editName || 'Not Set'}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-foreground-subtle uppercase tracking-widest mb-1 block">Gender</label>
                  <p className="text-sm font-bold text-white">{editGender || 'Not Set'}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-foreground-subtle uppercase tracking-widest mb-1 block">Date of Birth</label>
                  <p className="text-sm font-bold text-white">{editDob || 'Not Set'}</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2">
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-foreground-subtle uppercase tracking-widest mb-1 block">Full Name</label>
                  <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="w-full bg-[#16171C] border border-white/5 text-sm rounded-lg py-2.5 px-3 text-white focus:border-[#4CE3BC]/50 focus:outline-none" placeholder="Enter your valid full name" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-foreground-subtle uppercase tracking-widest mb-1 block">Gender</label>
                  <select value={editGender} onChange={e => setEditGender(e.target.value)} className="w-full bg-[#16171C] border border-white/5 text-sm rounded-lg py-2.5 px-3 text-white focus:border-[#4CE3BC]/50 focus:outline-none appearance-none">
                    <option>Prefer not to say</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Non-binary</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-foreground-subtle uppercase tracking-widest mb-1 block">Date of Birth</label>
                  <input type="date" value={editDob} onChange={e => setEditDob(e.target.value)} className="w-full bg-[#16171C] border border-white/5 text-sm rounded-lg py-2.5 px-3 text-white focus:border-[#4CE3BC]/50 focus:outline-none [&::-webkit-calendar-picker-indicator]:invert" />
                </div>
              </div>
            )}
          </div>

          <div className="bg-card border border-border p-6 rounded-3xl space-y-6">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
               <Bell size={16} className="text-primary"/> Notifications
            </h3>
            <div className="space-y-4">
              <div 
                onClick={toggleAlerts}
                className="flex items-center justify-between p-2 hover:bg-foreground/5 rounded-xl transition-colors cursor-pointer"
              >
                 <div>
                   <p className="text-sm font-bold text-foreground select-none">Email Alerts</p>
                   <p className="text-xs text-foreground-muted select-none">Receive summaries of overdue payments</p>
                 </div>
                 <div className={`w-11 h-6 rounded-full flex items-center p-0.5 transition-colors duration-300 ${emailAlerts ? 'bg-primary justify-end' : 'bg-foreground/20 justify-start'}`}>
                    <motion.div 
                      layout
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="w-5 h-5 bg-white rounded-full shadow-sm"
                    />
                 </div>
              </div>
              <div 
                onClick={toggleReports}
                className="flex items-center justify-between p-2 hover:bg-foreground/5 rounded-xl transition-colors cursor-pointer"
              >
                 <div>
                   <p className="text-sm font-bold text-foreground select-none">Weekly Reports</p>
                   <p className="text-xs text-foreground-muted select-none">Get a PDF of your revenue performance</p>
                 </div>
                 <div className={`w-11 h-6 rounded-full flex items-center p-0.5 transition-colors duration-300 ${weeklyReports ? 'bg-primary justify-end' : 'bg-foreground/20 justify-start'}`}>
                    <motion.div 
                      layout
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="w-5 h-5 bg-white rounded-full shadow-sm"
                    />
                 </div>
              </div>
              
              {/* Test Email Dispatcher */}
              <div className="pt-4 mt-2 border-t border-white/5">
                <button 
                  onClick={testEmail}
                  disabled={isTestingEmail}
                  className="w-full py-3 bg-zinc-900 border border-white/10 text-white text-xs font-bold rounded-xl hover:bg-zinc-800 hover:border-primary/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
                >
                  {isTestingEmail ? <Loader2 size={14} className="animate-spin text-primary" /> : <Send size={14} className="text-primary" />}
                  {isTestingEmail ? 'Dispatching via Resend...' : 'Send Test Weekly Report'}
                </button>
              </div>

            </div>
          </div>

          {/* Security - Change Password */}
          <div className="bg-card border border-border p-6 rounded-3xl space-y-6">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
               <Lock size={16} className="text-primary"/> Security
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-foreground-subtle uppercase tracking-widest mb-1 block">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full bg-[#16171C] border border-white/5 text-sm rounded-lg py-2.5 px-3 pr-10 text-white focus:border-[#4CE3BC]/50 focus:outline-none"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                  >
                    {showNewPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-foreground-subtle uppercase tracking-widest mb-1 block">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#16171C] border border-white/5 text-sm rounded-lg py-2.5 px-3 text-white focus:border-[#4CE3BC]/50 focus:outline-none"
                  placeholder="Repeat new password"
                />
              </div>

              {passwordMessage && (
                <p className={`text-xs font-bold ${passwordMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                  {passwordMessage.text}
                </p>
              )}

              <button
                onClick={changePassword}
                disabled={isChangingPassword}
                className="w-full py-3 bg-foreground/5 border border-white/5 text-white text-xs font-bold rounded-xl hover:bg-foreground/10 hover:border-primary/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 uppercase tracking-widest"
              >
                {isChangingPassword ? <Loader2 size={14} className="animate-spin text-primary" /> : <Lock size={14} className="text-primary" />}
                {isChangingPassword ? 'Updating...' : 'Change Password'}
              </button>
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
          <div className="pt-8 border-t border-border mt-4">
            <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-3 text-center">Danger Zone</p>
            <button 
              onClick={deleteAccount}
              disabled={isDeleting}
              className="w-full py-3 bg-red-500/10 border border-red-500/20 text-red-500 font-bold rounded-2xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest disabled:opacity-50"
            >
              {isDeleting ? <Loader2 size={16} className="animate-spin" /> : 'Delete Permanently'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
