import { create } from 'zustand';

interface ISidebarState {
  isOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
}

const useSidebarStore = create<ISidebarState>((set) => ({
  isOpen: false,
  toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
  closeSidebar: () => set({ isOpen: false }),
}));

export default useSidebarStore;
