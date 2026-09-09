"use client";

import { useUIStore } from "@/src/store";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  ChevronDown,
  ClipboardList,
  LayoutDashboard,
  MoreHorizontal,
  Package,
  Users,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogoutButton } from "../logout/Logout";

type Section =
  | "overview"
  | "products"
  | "purchases"
  | "sales"
  | "kardex"
  | "users";

const navItems: {
  id: Section;
  label: string;
  icon: typeof LayoutDashboard;
  url: string;
}[] = [
  { id: "products", label: "Productos", icon: Package, url: "/products" },
  {
    id: "purchases",
    label: "Compras",
    icon: ArrowDownToLine,
    url: "/purchases",
  },
  { id: "sales", label: "Ventas", icon: ArrowUpFromLine, url: "/sales" },
  { id: "kardex", label: "Kardex", icon: ClipboardList, url: "/kardex" },
  { id: "users", label: "Usuarios", icon: Users, url: "/users" },
];

export const Sidebar = () => {
  const [activeSection, setActiveSection] = useState<Section>("products");
  const isSideMenuOpen = useUIStore((state) => state.isSideMenuOpen);
  const closeMenu = useUIStore((state) => state.closeSideMenu);
  const router = useRouter();

  return (
    <div>
      <aside className={`sidebar ${isSideMenuOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <button
            className="icon-button mobile-close"
            onClick={() => closeMenu()}
            aria-label="Cerrar menú"
          >
            <X />
          </button>
        </div>
        <div className="workspace">
          <div className="workspace-avatar">AC</div>
          <div>
            <strong>Almacén Central</strong>
            <span>Empresa principal</span>
          </div>
          <ChevronDown aria-hidden="true" />
        </div>
        <nav className="main-nav" aria-label="Navegación principal">
          <span className="nav-label">GESTIÓN</span>
          {navItems.map(({ id, label, icon: Icon, url }) => (
            <button
              key={id}
              className={`nav-item ${activeSection === id ? "active" : ""}`}
              onClick={() => {
                setActiveSection(id);
                closeMenu();
                router.push(url);
              }}
            >
              <Icon aria-hidden="true" />
              <span>{label}</span>
              {id === "products" && <em>New</em>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="profile">
            <div className="profile-avatar">MG</div>
            <div>
              <strong>Paul Romero</strong>
              <span>Administrador</span>
            </div>
            <MoreHorizontal aria-hidden="true" />
          </div>

          <LogoutButton></LogoutButton>
        </div>
      </aside>
      {isSideMenuOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          onClick={closeMenu}
          aria-label="Cerrar menú"
        />
      )}
    </div>
  );
};
