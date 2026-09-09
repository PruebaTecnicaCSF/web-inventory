"use client";
import { useUIStore } from "@/src/store";
import { Menu } from "lucide-react";

export const Topbar = () => {
  const openMenu = useUIStore((state) => state.openSideMenu);

  return (
    <header className="topbar">
      <button
        className="icon-button menu-toggle"
        onClick={() => openMenu()}
        aria-label="Abrir menú"
      >
        <Menu />
      </button>
      
    </header>
  );
};
