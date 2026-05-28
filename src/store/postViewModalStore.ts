import { create } from 'zustand';
import type { PostWithMedia } from '@/src/queries/posts';

interface PostViewModal {
   isOpen: boolean;
   //either full post or post id can be passed
   post: PostWithMedia | null | string;
   open: (post: PostWithMedia | string, initialImageIndex?: number) => void;
   close: () => void;
   toggle: () => void;
   initialImageIndex: number;
}

export const usePostViewModal = create<PostViewModal>(set => ({
   isOpen: false,
   post: null,
   open: (post, initialImageIndex = 0) => set({ isOpen: true, post, initialImageIndex }),
   close: () => set({ isOpen: false, post: null, initialImageIndex: 0 }),
   toggle: () => set(state => ({ isOpen: !state.isOpen })),
   initialImageIndex: 0,
}));
