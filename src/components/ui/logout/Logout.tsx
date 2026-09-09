"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.replace("/auth/login");
    router.refresh();
  }

  return (
    <button type="button" onClick={handleLogout} >
      <span className="text-xs text-white font-semibold hover:text-gray-300 transition-colors">
        Cerrar sesión
      </span>
      
    </button>
  );
}
