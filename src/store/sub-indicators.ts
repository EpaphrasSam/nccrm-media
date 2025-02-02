import { create } from "zustand";
import { SubIndicator } from "@/services/sub-indicators/types";

interface SubIndicatorsState {
  // Data
  subIndicators: SubIndicator[];
  totalSubIndicators: number;
  filteredSubIndicators: SubIndicator[];

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Pagination
  currentPage: number;
  pageSize: number;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;

  // Actions
  addSubIndicator: () => void;
  editSubIndicator: (subIndicator: SubIndicator) => void;
  deleteSubIndicator: (subIndicatorId: string) => Promise<void>;

  // Loading States
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const filterSubIndicators = (
  subIndicators: SubIndicator[],
  searchQuery: string
) => {
  return subIndicators.filter((subIndicator) => {
    const matchesSearch = searchQuery
      ? subIndicator.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesSearch;
  });
};

export const useSubIndicatorsStore = create<SubIndicatorsState>((set, get) => ({
  // Initial Data
  subIndicators: [],
  totalSubIndicators: 0,
  filteredSubIndicators: [],

  // Search
  searchQuery: "",
  setSearchQuery: (query) => {
    set({ searchQuery: query });
    const state = get();
    const filtered = filterSubIndicators(state.subIndicators, query);
    set({
      filteredSubIndicators: filtered,
      totalSubIndicators: filtered.length,
      currentPage: 1,
    });
  },

  // Pagination
  currentPage: 1,
  pageSize: 10,
  setCurrentPage: (page) => set({ currentPage: page }),
  setPageSize: (size) => set({ pageSize: size }),

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
      // TODO: Add API call to delete sub indicator
      set((state) => {
        const newSubIndicators = state.subIndicators.filter(
          (s) => s.id !== subIndicatorId
        );
        const filtered = filterSubIndicators(
          newSubIndicators,
          state.searchQuery
        );
        return {
          subIndicators: newSubIndicators,
          filteredSubIndicators: filtered,
          totalSubIndicators: filtered.length,
          isLoading: false,
        };
      });
    } catch (error) {
      console.error("Failed to delete sub indicator:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  // Loading States
  isLoading: true,
  setLoading: (loading) => set({ isLoading: loading }),
}));
