import { create } from 'zustand';
import type { ModalStore } from './types';

export const useSearchPortalStore = create<ModalStore>(set => ({
   isOpen: false,
   open: () => set({ isOpen: true }),
   close: () => set({ isOpen: false }),
   toggle: () => set(state => ({ isOpen: !state.isOpen })),
}));
