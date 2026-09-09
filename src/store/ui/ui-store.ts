import { create } from "zustand";

interface State {
  isSideMenuOpen: boolean;
  loggedIn: boolean;

  openSideMenu: () => void;
  closeSideMenu: () => void;
  setLoggedIn: (value: boolean) => void;
}

export const useUIStore = create<State>((set) => ({
  isSideMenuOpen: false,
  loggedIn: false,

  openSideMenu: () => set({ isSideMenuOpen: true }),
  closeSideMenu: () => set({ isSideMenuOpen: false }),
  setLoggedIn: (value) => set({ loggedIn: value }),
}));
