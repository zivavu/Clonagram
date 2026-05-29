import { create } from 'zustand';
import type { PostWithMedia } from '@/src/queries/posts';

interface PostViewModal {
   isOpen: boolean;
   post: PostWithMedia | null | string;
   initialImageIndex: number;
   returnPath: string;
   open: (post: PostWithMedia | string, initialImageIndex?: number) => void;
   openWithUrl: (
      post: PostWithMedia | string,
      urlPath: string,
      returnPath: string,
      initialImageIndex?: number,
   ) => void;
   close: () => void;
   closeAndRestoreUrl: () => void;
   toggle: () => void;
}

export const usePostViewModal = create<PostViewModal>((set, get) => ({
   isOpen: false,
   post: null,
   initialImageIndex: 0,
   returnPath: '',
   open: (post, initialImageIndex = 0) => set({ isOpen: true, post, initialImageIndex }),
   openWithUrl: (post, urlPath, returnPath, initialImageIndex = 0) => {
      window.history.pushState(null, '', urlPath);
      set({ isOpen: true, post, initialImageIndex, returnPath });
   },
   close: () => set({ isOpen: false, post: null, initialImageIndex: 0, returnPath: '' }),
   closeAndRestoreUrl: () => {
      const { returnPath } = get();
      if (returnPath) window.history.pushState(null, '', returnPath);
      set({ isOpen: false, post: null, initialImageIndex: 0, returnPath: '' });
   },
   toggle: () => set(state => ({ isOpen: !state.isOpen })),
}));
