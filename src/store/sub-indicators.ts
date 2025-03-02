import { create } from "zustand";
import type {
  SubIndicatorWithMainIndicator,
  SubIndicatorCreateInput,
  SubIndicatorUpdateInput,
  SubIndicatorQueryParams,
} from "@/services/sub-indicators/types";
import { subIndicatorService } from "@/services/sub-indicators/api";

interface SubIndicatorsState {
  // Data
  subIndicators: SubIndicatorWithMainIndicator[];
  totalSubIndicators: number;
  totalPages: number;
  currentSubIndicator?: SubIndicatorWithMainIndicator;

  // Filters & Pagination
  filters: SubIndicatorQueryParams;
  setFilters: (filters: Partial<SubIndicatorQueryParams>) => void;
  resetFilters: () => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Actions
  addSubIndicator: () => void;
  editSubIndicator: (subIndicator: SubIndicatorWithMainIndicator) => void;
  deleteSubIndicator: (subIndicatorId: string) => Promise<void>;
  createSubIndicator: (subIndicator: SubIndicatorCreateInput) => Promise<void>;
  updateSubIndicator: (
    id: string,
    subIndicator: SubIndicatorUpdateInput
  ) => Promise<void>;

  // Loading States
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const DEFAULT_FILTERS: SubIndicatorQueryParams = {
  page: 1,
  limit: 20,
};

export const useSubIndicatorsStore = create<SubIndicatorsState>((set) => ({
  // Initial Data
  subIndicators: [],
  totalSubIndicators: 0,
  totalPages: 0,
  currentSubIndicator: undefined,

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
  addSubIndicator: () => {
    window.location.href = "/admin/sub-indicators/new";
  },
  editSubIndicator: (subIndicator) => {
    window.location.href = `/admin/sub-indicators/${subIndicator.id}/edit`;
  },
  deleteSubIndicator: async (subIndicatorId) => {
    try {
      set({ isLoading: true });
      await subIndicatorService.delete(subIndicatorId);
      set((state) => ({
        subIndicators: state.subIndicators.filter(
          (t) => t.id !== subIndicatorId
        ),
        totalSubIndicators: state.totalSubIndicators - 1,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Failed to delete sub indicator:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  createSubIndicator: async (subIndicatorData) => {
    try {
      set({ isLoading: true });
      await subIndicatorService.create(subIndicatorData);
      set({ isLoading: false });
      // Navigate to sub indicators list after creation
      window.location.href = "/admin/sub-indicators";
    } catch (error) {
      console.error("Failed to create sub indicator:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  updateSubIndicator: async (id, subIndicatorData) => {
    try {
      set({ isLoading: true });
      await subIndicatorService.update(id, subIndicatorData);
      set({ isLoading: false });
      // Navigate to sub indicators list after update
      window.location.href = "/admin/sub-indicators";
    } catch (error) {
      console.error("Failed to update sub indicator:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  // Loading States
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
}));
