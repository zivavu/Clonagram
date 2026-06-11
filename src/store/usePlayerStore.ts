import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PlayerStore {
   volume: number;
   previousVolume: number;
   setVolume: (volume: number) => void;
   mute: () => void;
   unmute: () => void;
   activePlayerId: string | null;
   claimPlayback: (id: string) => void;
   releasePlayback: (id: string) => void;
   pauseAll: () => void;
}

export const usePlayerStore = create<PlayerStore>()(
   persist(
      set => ({
         volume: 0,
         previousVolume: 1,
         setVolume: (volume: number) =>
            set({ volume, ...(volume > 0 ? { previousVolume: volume } : {}) }),
         mute: () =>
            set(state => (state.volume > 0 ? { previousVolume: state.volume, volume: 0 } : {})),
         unmute: () => set(state => ({ volume: state.previousVolume })),
         activePlayerId: null,
         claimPlayback: (id: string) => set({ activePlayerId: id }),
         releasePlayback: (id: string) =>
            set(state => (state.activePlayerId === id ? { activePlayerId: null } : {})),
         pauseAll: () => set({ activePlayerId: null }),
      }),
      {
         name: 'player-storage',
         partialize: state => ({ previousVolume: state.previousVolume }),
      },
   ),
);
