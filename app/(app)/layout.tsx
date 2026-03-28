"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import StoreInitializer from "@/components/StoreInitializer";
import OnboardingGuard from "@/components/OnboardingGuard";
import { useState } from "react";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <StoreInitializer />
      <OnboardingGuard />
      
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div 
            className="w-[280px] h-full bg-card shadow-2xl animate-in slide-in-from-left duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      <main className="flex-1 h-screen overflow-y-auto flex flex-col relative">
        <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
        <div className="flex-1 overflow-x-hidden pt-2">
          {children}
        </div>
      </main>
    </div>
  );
}
