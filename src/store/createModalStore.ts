import { create } from 'zustand';

export interface ModalStore {
   isOpen: boolean;
   open: () => void;
   close: () => void;
   toggle: () => void;
}

export function createModalStore() {
   return create<ModalStore>(set => ({
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set(state => ({ isOpen: !state.isOpen })),
   }));
}

export interface ModalStoreWithData<T> {
   isOpen: boolean;
   data: T | null;
   open: (data: T) => void;
   close: () => void;
   toggle: () => void;
}

export function createModalStoreWithData<T>() {
   return create<ModalStoreWithData<T>>(set => ({
      isOpen: false,
      data: null,
      open: (data: T) => set({ isOpen: true, data }),
      close: () => set({ isOpen: false, data: null }),
      toggle: () => set(state => ({ isOpen: !state.isOpen })),
   }));
}

export const useNotificationsPortalStore = createModalStore();
export const useSearchPortalStore = createModalStore();
export const useCreateStoryModalStore = createModalStore();
export const useNewMessageModalStore = createModalStore();
export const useSettingsPopoverStore = createModalStore();
export const useNewNoteModalStore = createModalStore();
export const useNewHighlightModalStore = createModalStore();

export const useOwnerActionsModal = createModalStoreWithData<string>();

type HighlightActionsData = {
   highlightId: string;
   title: string;
   closeHref: string;
};
export const useHighlightActionsModalStore = createModalStoreWithData<HighlightActionsData>();

export const useSharePostModal = createModalStoreWithData<string>();

type EditHighlightStoriesData = { highlightId: string };
export const useEditHighlightStoriesModalStore =
   createModalStoreWithData<EditHighlightStoriesData>();

export type CreatePostMode = 'post' | 'reel';

interface CreatePostModalStore extends ModalStore {
   mode: CreatePostMode;
   open: (mode?: CreatePostMode) => void;
}

export const useCreatePostModalStore = create<CreatePostModalStore>(set => ({
   isOpen: false,
   mode: 'post',
   open: (mode = 'post') => set({ isOpen: true, mode }),
   close: () => set({ isOpen: false }),
   toggle: () => set(state => ({ isOpen: !state.isOpen })),
}));

export type FollowListType = 'followers' | 'following';

interface FollowListModalStore {
   isOpen: boolean;
   type: FollowListType;
   userId: string;
   open: (type: FollowListType, userId: string) => void;
   close: () => void;
}

export const useFollowListModal = create<FollowListModalStore>(set => ({
   isOpen: false,
   type: 'followers',
   userId: '',
   open: (type, userId) => set({ isOpen: true, type, userId }),
   close: () => set({ isOpen: false }),
}));
