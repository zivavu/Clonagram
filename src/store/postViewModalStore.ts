import { create } from 'zustand';
import type { PostWithMedia } from '@/src/queries/posts';

interface PostViewModal {
   isOpen: boolean;
   post: PostWithMedia | null | string;
   initialImageIndex: number;
   open: (post: PostWithMedia | string, initialImageIndex?: number) => void;
   close: () => void;
   toggle: () => void;
}

export const usePostViewModal = create<PostViewModal>(set => ({
   isOpen: false,
   post: null,
   initialImageIndex: 0,
   open: (post, initialImageIndex = 0) => set({ isOpen: true, post, initialImageIndex }),
   close: () => set({ isOpen: false, post: null, initialImageIndex: 0 }),
   toggle: () => set(state => ({ isOpen: !state.isOpen })),
}));
