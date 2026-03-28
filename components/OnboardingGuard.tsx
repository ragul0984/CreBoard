'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/src/utils/supabase/client';
import { useStore } from '@/src/store';
import { UserRound, Phone, CheckCircle2, Loader2, Calendar } from 'lucide-react';

export default function OnboardingGuard() {
  const supabase = createClient();
  const userId = useStore(state => state.userId);
  const isInitialized = useStore(state => state.isInitialized);
  // We'll read isOnboarded locally to avoid modifying the massive store completely, or we will modify the store. 
  // Let's use the local state fetched during first mount, or global state. We assume `isOnboarded` is in the store.
  const isOnboarded = useStore(state => (state as any).isOnboarded); 

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form Data
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('Prefer not to say');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  // Do not block rendering if store isn't fetched, or if user is logged out, or if already onboarded
  if (!isInitialized || !userId || isOnboarded === true) return null;
  if (isOnboarded === undefined) return null; // Waiting for store to fully hydrate this field

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !dob) {
      setError("Please fill out your Name and DOB.");
      return;
    }
    setError('');
    setStep(2);
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setLoading(true);
    setError('');
    
    // Direct Profile Update (OTP Network Request Bypassed)
    const { error: dbError } = await supabase.from('profiles').update({
      full_name: fullName,
      gender: gender,
      dob: dob,
      phone: phone,
      is_onboarded: true,
      updated_at: new Date()
    }).eq('id', userId);

    if (dbError) {
      setError("Database Error: " + dbError.message);
      setLoading(false);
      return;
    }

    // Resolve onboarding and force hydration
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-md bg-[#0F1014] border border-white/5 rounded-2xl shadow-2xl relative overflow-hidden"
      >
        {/* Header Progress */}
        <div className="bg-[#16171C] p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white mb-2">Welcome to CreBoard</h2>
          <p className="text-sm text-zinc-400">Complete your profile to unlock your dashboard.</p>
          
          <div className="flex items-center gap-2 mt-6">
            <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-[#4CE3BC]' : 'bg-white/10'}`} />
            <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-[#4CE3BC]' : 'bg-white/10'}`} />
          </div>
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form 
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleDetailsSubmit} 
                className="space-y-5"
              >
                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1 block">Full Name</label>
                  <div className="relative">
                    <UserRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input 
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-[#16171C] border border-white/5 text-white text-sm rounded-xl py-3 pl-10 pr-3 focus:outline-none focus:border-[#4CE3BC]/50 transition-colors"
                      placeholder="Jane Doe"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1 block">Gender</label>
                    <select 
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full bg-[#16171C] border border-white/5 text-white text-sm rounded-xl py-3 px-3 focus:outline-none focus:border-[#4CE3BC]/50 transition-colors appearance-none"
                    >
                      <option value="Prefer not to say">Prefer not to say</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1 block">Date of Birth</label>
                    <div className="relative">
                      <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                      <input 
                        type="date" 
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full bg-[#16171C] border border-white/5 text-white text-sm rounded-xl py-3 py-[11px] pl-10 pr-3 focus:outline-none focus:border-[#4CE3BC]/50 transition-colors [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                        required
                      />
                    </div>
                  </div>
                </div>

                {error && <p className="text-red-400 text-xs font-bold">{error}</p>}
                
                <button type="submit" className="w-full py-3 bg-[#4CE3BC] text-black font-bold text-sm rounded-xl hover:bg-white transition-colors uppercase tracking-widest mt-4">
                  Continue
                </button>
              </motion.form>
            )}

            {step === 2 && (
              <motion.form 
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handlePhoneSubmit} 
                className="space-y-5"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-[#4CE3BC]/10 text-[#4CE3BC] flex items-center justify-center mx-auto mb-4 border border-[#4CE3BC]/20">
                    <Phone size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Contact Details</h3>
                  <p className="text-sm text-zinc-400">Add your primary mobile number to continue.</p>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1 block">Mobile Number</label>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#16171C] border border-white/5 text-white text-lg font-bold rounded-xl p-4 text-center focus:outline-none focus:border-[#4CE3BC]/50 transition-colors tracking-widest"
                    placeholder="+1 234 567 8900"
                    required
                  />
                  <p className="text-[10px] text-zinc-500 text-center mt-2">Include country code (e.g. +1 or +91)</p>
                </div>

                {error && <p className="text-red-400 text-xs font-bold text-center">{error}</p>}
                
                <button type="submit" disabled={loading} className="w-full py-3 bg-[#4CE3BC] text-black font-bold text-sm rounded-xl hover:bg-white transition-colors uppercase tracking-widest disabled:opacity-50 flex justify-center gap-2">
                  {loading ? <Loader2 size={16} className="animate-spin" /> : 'Finalize Profile'}
                </button>
                <button type="button" onClick={() => setStep(1)} className="w-full py-2 text-zinc-500 text-xs font-bold hover:text-white uppercase tracking-widest transition-colors">
                  Back
                </button>
              </motion.form>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
