import { create } from 'zustand';

export interface ModalStore {
   isOpen: boolean;
   open: () => void;
   close: () => void;
   toggle: () => void;
}

export function createModalStore() {
   return create<ModalStore>(set => ({
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set(state => ({ isOpen: !state.isOpen })),
   }));
}
