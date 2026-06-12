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
export const useOwnerActionsModal = createModalStoreWithData<string>();
export const useNewHighlightModalStore = createModalStore();

type HighlightActionsData = {
   highlightId: string;
   title: string;
   closeHref: string;
};
export const useHighlightActionsModalStore = createModalStoreWithData<HighlightActionsData>();
