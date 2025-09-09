import { create } from 'zustand';

interface AppState {
  showPropertyPage: boolean;
  setShowPropertyPage: (show: boolean) => void;
  togglePropertyPage: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  showPropertyPage: false,
  setShowPropertyPage: (show) => set({ showPropertyPage: show }),
  togglePropertyPage: () =>
    set((state) => ({ showPropertyPage: !state.showPropertyPage })),
}));
