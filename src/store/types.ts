export type { ModalStore } from './createModalStore';

export type CreatePostMode = 'post' | 'reel';

export type CreatePostModalStore = ModalStore & {
   mode: CreatePostMode;
   open: (mode?: CreatePostMode) => void;
};
