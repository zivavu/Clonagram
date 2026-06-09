import { create } from 'zustand';

export type FollowListType = 'followers' | 'following';

interface FollowListModal {
   isOpen: boolean;
   type: FollowListType;
   userId: string;
   username: string;
   open: (type: FollowListType, userId: string, username: string) => void;
   close: () => void;
}

export const useFollowListModal = create<FollowListModal>(set => ({
   isOpen: false,
   type: 'followers',
   userId: '',
   username: '',
   open: (type, userId, username) => set({ isOpen: true, type, userId, username }),
   close: () => set({ isOpen: false }),
}));
