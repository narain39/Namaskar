import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  isMobile: boolean;
}

interface UIActions {
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setIsMobile: (isMobile: boolean) => void;
  closeSidebarOnMobile: () => void;
}

export const useUIStore = create<UIState & UIActions>((set, get) => ({
  isSidebarOpen: false, // Closed by default on mobile
  isMobile: true, // Assume mobile first

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  setSidebarOpen: (open) => set({ isSidebarOpen: open }),

  setIsMobile: (isMobile) => set({ isMobile }),

  closeSidebarOnMobile: () => {
    const { isMobile } = get();
    if (isMobile) {
      set({ isSidebarOpen: false });
    }
  },
}));
