import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import StoreInitializer from "@/components/StoreInitializer";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen">
      <StoreInitializer />
      <Sidebar />
      <main className="flex-1 h-screen overflow-y-auto flex flex-col">
        <Header />
        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
