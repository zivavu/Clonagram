import { create } from 'zustand';
import type { PostWithMedia } from '@/src/queries/posts';

interface OpenOptions {
   initialImageIndex?: number;
   returnPath?: string;
   suppressAnimation?: boolean;
}

interface PostViewModal {
   isOpen: boolean;
   post: PostWithMedia | null | string;
   initialImageIndex: number;
   returnPath: string | null;
   suppressAnimation: boolean;
   open: (post: PostWithMedia | string, options?: OpenOptions) => void;
   close: () => void;
   toggle: () => void;
}

export const usePostViewModal = create<PostViewModal>(set => ({
   isOpen: false,
   post: null,
   initialImageIndex: 0,
   returnPath: null,
   suppressAnimation: false,
   open: (post, options = {}) =>
      set({
         isOpen: true,
         post,
         initialImageIndex: options.initialImageIndex ?? 0,
         returnPath: options.returnPath ?? null,
         suppressAnimation: options.suppressAnimation ?? false,
      }),
   close: () =>
      set({
         isOpen: false,
         post: null,
         initialImageIndex: 0,
         returnPath: null,
         suppressAnimation: false,
      }),
   toggle: () => set(state => ({ isOpen: !state.isOpen })),
}));
