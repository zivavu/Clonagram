import { create } from 'zustand';

interface NewMessageModalStore {
   isOpen: boolean;
   open: () => void;
   close: () => void;
   toggle: () => void;
}

export const useNewMessageModalStore = create<NewMessageModalStore>(set => ({
   isOpen: false,
   open: () => set({ isOpen: true }),
   close: () => set({ isOpen: false }),
   toggle: () => set(state => ({ isOpen: !state.isOpen })),
}));
