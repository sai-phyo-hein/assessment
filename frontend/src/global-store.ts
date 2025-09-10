
export interface Property {
  id: number;
  name: string;
  per_night_price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  beds: number;
}
import { create } from 'zustand';

export interface Image {
  src: string;
  alt?: string;
  type?: string;
}

interface AppState {
  showPropertyPage: boolean;
  setShowPropertyPage: (show: boolean) => void;
  showPropertyDetailPage: boolean;
  setShowPropertyDetailPage: (show: boolean) => void;
  togglePropertyPage: () => void;
  pageId?: string;
  setPageId?: (id: string) => void;
  selectedProperty?: Property;
  setSelectedProperty?: (property: Property) => void;
  isAuth?: boolean;
  setIsAuth?: (auth: boolean) => void;
  isManager?: boolean;
  setIsManager?: (manager: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  showPropertyPage: false,
  setShowPropertyPage: (show) => set({ showPropertyPage: show }),
  showPropertyDetailPage: false,
  setShowPropertyDetailPage: (show) => set({ showPropertyDetailPage: show }),
  togglePropertyPage: () =>
    set((state) => ({ showPropertyPage: !state.showPropertyPage })),
  setPageId: (id) => set({ pageId: id }),
  setSelectedProperty: (property) => set({ selectedProperty: property }),
  setIsAuth: (auth) => set({ isAuth: auth }),
  setIsManager: (manager) => set({ isManager: manager }),
}));
