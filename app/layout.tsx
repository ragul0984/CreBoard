import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LoadingProvider } from "@/src/context/LoadingContext";
import { SleekLoader } from "@/components/ui/SleekLoader";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "CreBoard",
  description: "The operating system for content creators. Manage deals, revenue, brands — all in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased font-sans scroll-smooth" suppressHydrationWarning>
      <body className="min-h-full text-[var(--color-foreground)] bg-[var(--color-background)]">
        <Suspense fallback={null}>
          <LoadingProvider>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
              <SleekLoader />
              {children}
            </ThemeProvider>
          </LoadingProvider>
        </Suspense>
      </body>
    </html>
  );
}
