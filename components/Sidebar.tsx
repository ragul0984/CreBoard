'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Layers, IndianRupee, CreditCard, BarChart3, Calendar, Users, X, AlertCircle, User } from 'lucide-react';

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  const links = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Deals', icon: Layers, href: '/deals' },
    { name: 'Revenue', icon: IndianRupee, href: '/revenue' },
    { name: 'Payments', icon: CreditCard, href: '/payments' },
    { name: 'Analytics', icon: BarChart3, href: '/analytics' },
    { name: 'Planner', icon: Calendar, href: '/planner' },
    { name: 'Brand CRM', icon: Users, href: '/crm' },
    { name: 'Alerts', icon: AlertCircle, href: '/alerts' },
    { name: 'Profile', icon: User, href: '/profile' },
  ];

  return (
    <aside className="w-full md:w-[220px] border-r border-border bg-card h-full md:h-screen flex flex-col py-6 sticky top-0 shrink-0">
      <div className="px-5 mb-8 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-sm">C</div>
          <span className="text-lg font-semibold tracking-tight text-foreground">CreBoard</span>
        </div>
        <button onClick={onClose} className="md:hidden p-2 -mr-2 text-foreground-muted hover:bg-foreground/5 rounded-lg">
          <X size={20} />
        </button>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm ${
                isActive
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-foreground-muted hover:text-foreground hover:bg-foreground/5'
              }`}
            >
              <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
