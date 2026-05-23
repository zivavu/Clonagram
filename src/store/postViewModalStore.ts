import { create } from 'zustand';
import type { PostWithMedia } from '@/src/queries/posts';

interface PostViewModal {
   isOpen: boolean;
   post: PostWithMedia | null;
   open: (post: PostWithMedia) => void;
   close: () => void;
   toggle: () => void;
}

export const usePostViewModal = create<PostViewModal>(set => ({
   isOpen: false,
   post: null,
   open: (post: PostWithMedia) => set({ isOpen: true, post }),
   close: () => set({ isOpen: false, post: null }),
   toggle: () => set(state => ({ isOpen: !state.isOpen })),
}));
