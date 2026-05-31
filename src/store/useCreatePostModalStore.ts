import { create } from 'zustand';
import type { CreatePostModalStore } from './types';

export const useCreatePostModalStore = create<CreatePostModalStore>(set => ({
   isOpen: false,
   mode: 'post',
   open: (mode = 'post') => set({ isOpen: true, mode }),
   close: () => set({ isOpen: false }),
   toggle: () => set(state => ({ isOpen: !state.isOpen })),
}));
