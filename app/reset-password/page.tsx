'use client';
import { useState } from 'react';
import { createClient } from '@/src/utils/supabase/client';
import { Lock, ArrowRight, Loader2, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const supabase = createClient();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#f5f5f5] flex items-center justify-center p-6 selection:bg-white selection:text-black">
      <div className="w-full max-w-[400px] space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center text-center space-y-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded bg-white text-black flex items-center justify-center font-black text-xl group-hover:scale-110 transition-transform">C</div>
            <span className="text-2xl font-bold tracking-tight">CreBoard</span>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight lowercase">
              {success ? 'Password updated' : 'Set new password'}
            </h1>
            <p className="text-[#666] text-sm font-medium mt-1 lowercase">
              {success ? 'You can now sign in with your new password' : 'Enter and confirm your new password below'}
            </p>
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-8 rounded-2xl space-y-6">
          {success ? (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mx-auto border border-green-500/20">
                <CheckCircle2 size={32} />
              </div>
              <p className="text-sm text-[#888]">Your password has been changed successfully.</p>
              <Link
                href="/login"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-black rounded-xl font-bold text-sm hover:bg-[#e0e0e0] transition-all uppercase tracking-widest"
              >
                Go to Sign In <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#444] uppercase tracking-[0.2em]">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444]" size={16} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#050505] border border-[#1a1a1a] rounded-xl py-3 pl-12 pr-12 text-sm focus:border-white transition-colors outline-none font-medium"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#444] hover:text-white transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#444] uppercase tracking-[0.2em]">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444]" size={16} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-[#050505] border border-[#1a1a1a] rounded-xl py-3 pl-12 pr-4 text-sm focus:border-white transition-colors outline-none font-medium"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold rounded-lg text-center lowercase">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-[#1a1a1a] hover:bg-[#111] text-white rounded-xl font-bold text-sm transition-all uppercase tracking-widest disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : 'Update Password'}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>
          )}
        </div>

        <div className="text-center">
          <Link
            href="/login"
            className="text-xs text-[#666] hover:text-white transition-colors font-bold uppercase tracking-widest"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
