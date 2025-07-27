import { create } from "zustand";

interface AdminUIState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  openSidebar: () => void;
}

export const useAdminUIStore = create<AdminUIState>((set) => ({
  sidebarOpen: false,
  toggleSidebar: () => set((state: AdminUIState) => ({ ...state, sidebarOpen: !state.sidebarOpen })),
  closeSidebar: () => set((state: AdminUIState) => ({ ...state, sidebarOpen: false })),
  openSidebar: () => set((state: AdminUIState) => ({ ...state, sidebarOpen: true })),
}));
