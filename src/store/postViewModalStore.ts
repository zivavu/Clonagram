import { create } from 'zustand';

interface PostViewModal {
   isOpen: boolean;
   postId: string | null;
   open: (postId: string) => void;
   close: () => void;
   toggle: () => void;
}

export const usePostViewModal = create<PostViewModal>(set => ({
   isOpen: false,
   postId: null,
   open: (postId: string) => set({ isOpen: true, postId }),
   close: () => set({ isOpen: false, postId: null }),
   toggle: () => set(state => ({ isOpen: !state.isOpen })),
}));
