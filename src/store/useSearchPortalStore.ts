import { create } from 'zustand';

interface SearchPortalStore {
   isOpen: boolean;
   open: () => void;
   close: () => void;
   toggle: () => void;
}

export const useSearchPortalStore = create<SearchPortalStore>(set => ({
   isOpen: false,
   open: () => set({ isOpen: true }),
   close: () => set({ isOpen: false }),
   toggle: () => set(state => ({ isOpen: !state.isOpen })),
}));
