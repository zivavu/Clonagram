import { create } from 'zustand';

interface AiFilterStore {
   isReloading: boolean;
   setReloading: (value: boolean) => void;
}

export const useAiFilterStore = create<AiFilterStore>(set => ({
   isReloading: false,
   setReloading: value => set({ isReloading: value }),
}));
