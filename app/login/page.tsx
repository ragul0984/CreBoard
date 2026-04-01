'use client';
import { useState } from 'react';
import { createClient } from '@/src/utils/supabase/client';
import { ArrowRight, Mail, Lock, Chrome, Github, Sparkles, Loader2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useLoading } from '@/src/context/LoadingContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const { startLoading, stopLoading } = useLoading();

  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    startLoading();
    setError(null);
    setMessage(null);

    try {
      if (isForgotPassword) {
        try {
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
          });
          if (error) throw error;
          setMessage('Password reset link sent! Check your email inbox.');
        } catch (resetErr: any) {
          const msg = resetErr?.message || '';
          if (msg.includes('fetch') || msg.includes('rate')) {
            setError('Too many requests. Please wait a minute and try again.');
          } else {
            setError(msg || 'Failed to send reset email. Try again later.');
          }
        }
        setLoading(false);
        return;
      }

      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        setMessage('Check your email for the confirmation link.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
      stopLoading();
    }
  };

  const handleGoogleLogin = async () => {
    startLoading();
    const origin = window.location.origin;
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Failed to initialize Google Login');
      stopLoading();
    }
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
              {isForgotPassword ? 'Reset your password' : isSignUp ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="text-[#666] text-sm font-medium mt-1 lowercase">
              {isForgotPassword ? 'Enter your email to receive a reset link' : isSignUp ? 'Start managing your creator business' : 'Securely sign in to your dashboard'}
            </p>
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-8 rounded-2xl space-y-6">
          {!isForgotPassword && (
            <>
              {/* Social Auth */}
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-black rounded-xl font-bold text-sm hover:bg-[#e0e0e0] transition-all uppercase tracking-widest"
              >
                <Chrome size={18} />
                Continue with Google
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#1a1a1a]"></div></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0a0a0a] px-4 text-[#444] font-bold tracking-[0.2em]">OR</span></div>
              </div>
            </>
          )}

          {/* Email Form */}
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#444] uppercase tracking-[0.2em]">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444]" size={16} />
                <input
                  type="email"
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#050505] border border-[#1a1a1a] rounded-xl py-3 pl-12 pr-4 text-sm focus:border-white transition-colors outline-none font-medium"
                  required
                />
              </div>
            </div>

            {!isForgotPassword && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#444] uppercase tracking-[0.2em]">Password</label>
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
            )}

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold rounded-lg text-center lowercase">
                {error}
              </div>
            )}

            {message && (
              <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-bold rounded-lg text-center lowercase">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-[#1a1a1a] hover:bg-[#111] text-white rounded-xl font-bold text-sm transition-all uppercase tracking-widest disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : (isForgotPassword ? 'Send Reset Link' : isSignUp ? 'Sign Up' : 'Sign In')}
              {!loading && <ArrowRight size={18} />}
            </button>

            {!isSignUp && !isForgotPassword && (
              <button
                type="button"
                onClick={() => { setIsForgotPassword(true); setError(null); setMessage(null); }}
                className="w-full text-center text-xs text-[#888] hover:text-white transition-colors font-semibold pt-3 underline underline-offset-4 decoration-[#333] hover:decoration-white"
              >
                Forgot your password?
              </button>
            )}
          </form>
        </div>

        <div className="text-center">
          {isForgotPassword ? (
            <button
              onClick={() => { setIsForgotPassword(false); setError(null); setMessage(null); }}
              className="text-xs text-[#666] hover:text-white transition-colors font-bold uppercase tracking-widest"
            >
              Back to Sign In
            </button>
          ) : (
            <button
              onClick={() => { setIsSignUp(!isSignUp); setError(null); setMessage(null); }}
              className="text-xs text-[#666] hover:text-white transition-colors font-bold uppercase tracking-widest"
            >
              {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
