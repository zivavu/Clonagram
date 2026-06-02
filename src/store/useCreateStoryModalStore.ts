import { create } from 'zustand';

interface CreateStoryModalStore {
   isOpen: boolean;
   open: () => void;
   close: () => void;
}

export const useCreateStoryModalStore = create<CreateStoryModalStore>(set => ({
   isOpen: false,
   open: () => set({ isOpen: true }),
   close: () => set({ isOpen: false }),
}));
