import { Sidebar } from "@/src/components/ui/sidebar/Sidebar";
import { Topbar } from "@/src/components/ui/topbar/Topbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestion de Inventario",
  description: "Gestión de inventario",
};

export default function InventoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <Topbar></Topbar>
        {children}
      </main>
    </div>
  );
}
