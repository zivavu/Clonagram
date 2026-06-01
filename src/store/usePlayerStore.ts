import { create } from 'zustand';

interface PlayerStore {
   volume: number;
   setVolume: (volume: number) => void;
   activePlayerId: string | null;
   claimPlayback: (id: string) => void;
   releasePlayback: (id: string) => void;
   pauseAll: () => void;
}

export const usePlayerStore = create<PlayerStore>()(set => ({
   volume: 0,
   setVolume: (volume: number) => set({ volume }),
   activePlayerId: null,
   claimPlayback: (id: string) => set({ activePlayerId: id }),
   releasePlayback: (id: string) =>
      set(state => (state.activePlayerId === id ? { activePlayerId: null } : {})),
   pauseAll: () => set({ activePlayerId: null }),
}));
