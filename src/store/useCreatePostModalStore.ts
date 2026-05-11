import { create } from 'zustand';

interface CreatePostModalStore {
   isOpen: boolean;
   open: () => void;
   close: () => void;
   toggle: () => void;
}

export const useCreatePostModalStore = create<CreatePostModalStore>(set => ({
   isOpen: false,
   open: () => set({ isOpen: true }),
   close: () => set({ isOpen: false }),
   toggle: () => set(state => ({ isOpen: !state.isOpen })),
}));
