import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "../components/Sidebar";
import { ThemeProvider } from "../components/ThemeProvider";
import Header from "../components/Header";
import StoreInitializer from "../components/StoreInitializer";

export const metadata: Metadata = {
  title: "Creator OS",
  description: "Creator management dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased font-sans" suppressHydrationWarning>
      <body className="min-h-full flex text-[var(--color-foreground)] bg-[var(--color-background)]">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <StoreInitializer />
          <Sidebar />
          <main className="flex-1 h-screen overflow-y-auto flex flex-col">
            <Header />
            <div className="flex-1">
              {children}
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
