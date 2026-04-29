import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PlayerStore {
   volume: number;
   setVolume: (volume: number) => void;
}

export const usePlayerStore = create<PlayerStore>()(
   persist(
      set => ({
         volume: 1,
         setVolume: (volume: number) => set({ volume }),
      }),
      {
         name: 'player-preferences',
         partialize: state => ({ volume: state.volume }),
      },
   ),
);
