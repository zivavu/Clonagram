export interface ModalStore {
   isOpen: boolean;
   open: () => void;
   close: () => void;
   toggle: () => void;
}

export type CreatePostMode = 'post' | 'reel';

export interface CreatePostModalStore {
   isOpen: boolean;
   mode: CreatePostMode;
   open: (mode?: CreatePostMode) => void;
   close: () => void;
   toggle: () => void;
}
