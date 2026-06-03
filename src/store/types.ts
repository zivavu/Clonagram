import type { ModalStore } from './createModalStore';

export type { ModalStore };

export type CreatePostMode = 'post' | 'reel';

export interface CreatePostModalStore extends ModalStore {
   mode: CreatePostMode;
   open: (mode?: CreatePostMode) => void;
}
