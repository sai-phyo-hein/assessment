
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
  dbSelectedProperty?: Property;
  setDbSelectedProperty?: (property: Property | undefined) => void;
  isAuth?: boolean;
  setIsAuth?: (auth: boolean) => void;
  isManager?: boolean;
  setIsManager?: (manager: boolean) => void;
  // Date filtering for dashboard
  startDate?: Date | null | undefined;
  endDate?: Date | null | undefined;
  setDashboardDateRange?: (startDate: Date | null | undefined, endDate: Date | null | undefined) => void;
  // Date range constraints from reviews
  minDate?: Date | null | undefined;
  maxDate?: Date | null | undefined;
  setDateRangeConstraints?: (minDate: Date | null | undefined, maxDate: Date | null | undefined) => void;
  // Dashboard view toggle
  isSummaryView: boolean;
  setIsSummaryView: (isSummary: boolean) => void;
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
  setDbSelectedProperty: (property) => set({ dbSelectedProperty: property }),
  setIsAuth: (auth) => set({ isAuth: auth }),
  setIsManager: (manager) => set({ isManager: manager }),
  startDate: null,
  endDate: null,
  setDashboardDateRange: (startDate, endDate) => set({ startDate, endDate }),
  minDate: null,
  maxDate: null,
  setDateRangeConstraints: (minDate, maxDate) => set({ minDate, maxDate }),
  isSummaryView: true,
  setIsSummaryView: (isSummary) => set({ isSummaryView: isSummary }),
}));
