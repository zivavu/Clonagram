import { create } from 'zustand';
import type { PostWithMedia } from '@/src/queries/posts';

interface PostViewModal {
   isOpen: boolean;
   post: PostWithMedia | null;
   open: (post: PostWithMedia, initialImageIndex?: number) => void;
   close: () => void;
   toggle: () => void;
   initialImageIndex: number;
}

export const usePostViewModal = create<PostViewModal>(set => ({
   isOpen: false,
   post: null,
   open: (post: PostWithMedia, initialImageIndex = 0) => set({ isOpen: true, post, initialImageIndex }),
   close: () => set({ isOpen: false, post: null, initialImageIndex: 0 }),
   toggle: () => set(state => ({ isOpen: !state.isOpen })),
   initialImageIndex: 0,
}));
