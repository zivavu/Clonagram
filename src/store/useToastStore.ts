import { create } from 'zustand';

interface ToastStore {
   open: boolean;
   message: string;
   show: (message: string) => void;
   hide: () => void;
}

export const useToastStore = create<ToastStore>(set => ({
   open: false,
   message: '',
   show: message => set({ open: true, message }),
   hide: () => set({ open: false, message: '' }),
}));

export function toast(message: string) {
   useToastStore.getState().show(message);
}
