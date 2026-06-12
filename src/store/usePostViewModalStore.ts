import { create } from 'zustand';
import type { PostWithMedia } from '@/src/queries/posts';

interface OpenOptions {
   initialImageIndex?: number;
   returnPath?: string;
   suppressAnimation?: boolean;
}

interface PostViewModal {
   isOpen: boolean;
   postId: string | null;
   preloadedPost: PostWithMedia | null;
   initialImageIndex: number;
   returnPath: string | null;
   suppressAnimation: boolean;
   open: (post: PostWithMedia | string, options?: OpenOptions) => void;
   close: () => void;
   toggle: () => void;
}

function resolvePostId(post: PostWithMedia | string) {
   return typeof post === 'string' ? post : post.id;
}

function resolvePreloaded(post: PostWithMedia | string) {
   return typeof post === 'string' ? null : post;
}

export const usePostViewModal = create<PostViewModal>(set => ({
   isOpen: false,
   postId: null,
   preloadedPost: null,
   initialImageIndex: 0,
   returnPath: null,
   suppressAnimation: false,
   open: (post, options = {}) =>
      set({
         isOpen: true,
         postId: resolvePostId(post),
         preloadedPost: resolvePreloaded(post),
         initialImageIndex: options.initialImageIndex ?? 0,
         returnPath: options.returnPath ?? null,
         suppressAnimation: options.suppressAnimation ?? false,
      }),
   close: () =>
      set({
         isOpen: false,
         postId: null,
         preloadedPost: null,
         initialImageIndex: 0,
         returnPath: null,
         suppressAnimation: false,
      }),
   toggle: () => set(state => ({ isOpen: !state.isOpen })),
}));
