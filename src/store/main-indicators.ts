import { create } from "zustand";
import type {
  MainIndicatorWithThematicArea,
  MainIndicatorCreateInput,
  MainIndicatorUpdateInput,
  MainIndicatorQueryParams,
} from "@/services/main-indicators/types";
import { mainIndicatorService } from "@/services/main-indicators/api";

interface MainIndicatorsState {
  // Data
  mainIndicators: MainIndicatorWithThematicArea[];
  totalMainIndicators: number;
  totalPages: number;
  currentMainIndicator?: MainIndicatorWithThematicArea;

  // Filters & Pagination
  filters: MainIndicatorQueryParams;
  setFilters: (filters: Partial<MainIndicatorQueryParams>) => void;
  resetFilters: () => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Actions
  addMainIndicator: () => void;
  editMainIndicator: (mainIndicator: MainIndicatorWithThematicArea) => void;
  deleteMainIndicator: (mainIndicatorId: string) => Promise<void>;
  createMainIndicator: (
    mainIndicator: MainIndicatorCreateInput
  ) => Promise<void>;
  updateMainIndicator: (
    id: string,
    mainIndicator: MainIndicatorUpdateInput
  ) => Promise<void>;

  // Loading States
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const DEFAULT_FILTERS: MainIndicatorQueryParams = {
  page: 1,
  limit: 20,
};

export const useMainIndicatorsStore = create<MainIndicatorsState>((set) => ({
  // Initial Data
  mainIndicators: [],
  totalMainIndicators: 0,
  totalPages: 0,
  currentMainIndicator: undefined,

  // Filters & Pagination
  filters: DEFAULT_FILTERS,
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
  resetFilters: () => set({ filters: DEFAULT_FILTERS }),

  // Search
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Actions
  addMainIndicator: () => {
    window.location.href = "/admin/main-indicators/new";
  },
  editMainIndicator: (mainIndicator) => {
    window.location.href = `/admin/main-indicators/${mainIndicator.id}/edit`;
  },
  deleteMainIndicator: async (mainIndicatorId) => {
    try {
      set({ isLoading: true });
      await mainIndicatorService.delete(mainIndicatorId);
      set((state) => ({
        mainIndicators: state.mainIndicators.filter(
          (t) => t.id !== mainIndicatorId
        ),
        totalMainIndicators: state.totalMainIndicators - 1,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Failed to delete main indicator:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  createMainIndicator: async (mainIndicatorData) => {
    try {
      set({ isLoading: true });
      await mainIndicatorService.create(mainIndicatorData);
      set({ isLoading: false });
      // Navigate to main indicators list after creation
      window.location.href = "/admin/main-indicators";
    } catch (error) {
      console.error("Failed to create main indicator:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  updateMainIndicator: async (id, mainIndicatorData) => {
    try {
      set({ isLoading: true });
      await mainIndicatorService.update(id, mainIndicatorData);
      set({ isLoading: false });
      // Navigate to main indicators list after update
      window.location.href = "/admin/main-indicators";
    } catch (error) {
      console.error("Failed to update main indicator:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  // Loading States
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
}));
