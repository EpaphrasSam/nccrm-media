import { create } from "zustand";
import { MainIndicator } from "@/services/main-indicators/types";

interface MainIndicatorsState {
  // Data
  mainIndicators: MainIndicator[];
  totalMainIndicators: number;
  filteredMainIndicators: MainIndicator[];

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Pagination
  currentPage: number;
  pageSize: number;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;

  // Actions
  addMainIndicator: () => void;
  editMainIndicator: (mainIndicator: MainIndicator) => void;
  deleteMainIndicator: (mainIndicatorId: string) => Promise<void>;

  // Loading States
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const filterMainIndicators = (
  mainIndicators: MainIndicator[],
  searchQuery: string
) => {
  return mainIndicators.filter((mainIndicator) => {
    const matchesSearch = searchQuery
      ? mainIndicator.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesSearch;
  });
};

export const useMainIndicatorsStore = create<MainIndicatorsState>(
  (set, get) => ({
    // Initial Data
    mainIndicators: [],
    totalMainIndicators: 0,
    filteredMainIndicators: [],

    // Search
    searchQuery: "",
    setSearchQuery: (query) => {
      set({ searchQuery: query });
      const state = get();
      const filtered = filterMainIndicators(state.mainIndicators, query);
      set({
        filteredMainIndicators: filtered,
        totalMainIndicators: filtered.length,
        currentPage: 1,
      });
    },

    // Pagination
    currentPage: 1,
    pageSize: 10,
    setCurrentPage: (page) => set({ currentPage: page }),
    setPageSize: (size) => set({ pageSize: size }),

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
        // TODO: Add API call to delete main indicator
        set((state) => {
          const newMainIndicators = state.mainIndicators.filter(
            (m) => m.id !== mainIndicatorId
          );
          const filtered = filterMainIndicators(
            newMainIndicators,
            state.searchQuery
          );
          return {
            mainIndicators: newMainIndicators,
            filteredMainIndicators: filtered,
            totalMainIndicators: filtered.length,
            isLoading: false,
          };
        });
      } catch (error) {
        console.error("Failed to delete main indicator:", error);
        set({ isLoading: false });
        throw error;
      }
    },

    // Loading States
    isLoading: true,
    setLoading: (loading) => set({ isLoading: loading }),
  })
);
