"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, LogOut, User, Menu, Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/src/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/src/store";

export default function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
  const router = useRouter();
  
  const payments = useStore(state => state.payments);
  const overdueCount = payments.filter(p => p.status === 'Overdue').length;

  useEffect(() => {
    setMounted(true);
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur sticky top-0 z-40 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-lg hover:bg-foreground/5 md:hidden text-foreground-muted"
          aria-label="Open Menu"
        >
          <Menu size={20} />
        </button>
        <div className="font-medium text-sm text-foreground-muted hidden sm:block">
          Dashboard Overview
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-3 pr-4 border-r border-border">
            <Link 
              href="/alerts"
              className="p-2 rounded-lg text-foreground-muted hover:bg-foreground/5 relative mr-1"
              title="Alerts"
            >
              <Bell size={18} />
              {overdueCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-card" />
              )}
            </Link>

            <Link 
              href="/profile"
              className="flex items-center gap-3 hover:bg-foreground/5 p-1 rounded-xl transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20">
                <User size={16} />
              </div>
              <div className="hidden lg:block text-right">
                <p className="text-[10px] font-bold text-foreground-subtle uppercase tracking-widest leading-none mb-1">Account</p>
                <p className="text-xs font-bold truncate max-w-[150px] text-foreground">{user.email}</p>
              </div>
            </Link>

            <button 
              onClick={handleLogout}
              className="ml-2 p-2 rounded-lg text-foreground-subtle hover:text-red-500 hover:bg-red-500/10 transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        )}

        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 transition-colors text-gray-600 dark:text-gray-300"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        )}
      </div>
    </header>
  );
}
