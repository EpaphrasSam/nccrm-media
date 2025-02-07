import { create } from "zustand";
import { MainIndicatorWithThematicArea } from "@/services/main-indicators/types";
import {
  createMainIndicator as createMainIndicatorApi,
  updateMainIndicator as updateMainIndicatorApi,
} from "@/services/main-indicators/api";

interface MainIndicatorsState {
  // Data
  mainIndicators: MainIndicatorWithThematicArea[];
  totalMainIndicators: number;
  filteredMainIndicators: MainIndicatorWithThematicArea[];
  currentMainIndicator?: MainIndicatorWithThematicArea;

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
  editMainIndicator: (mainIndicator: MainIndicatorWithThematicArea) => void;
  deleteMainIndicator: (mainIndicatorId: string) => Promise<void>;
  createMainIndicator: (
    mainIndicator: Omit<MainIndicatorWithThematicArea, "id" | "createdAt">
  ) => Promise<void>;
  updateMainIndicator: (
    id: string,
    mainIndicator: Partial<MainIndicatorWithThematicArea>
  ) => Promise<void>;

  // Loading States
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const filterMainIndicators = (
  mainIndicators: MainIndicatorWithThematicArea[],
  searchQuery: string
) => {
  return mainIndicators.filter((indicator) => {
    const matchesSearch = searchQuery
      ? indicator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        indicator.description.toLowerCase().includes(searchQuery.toLowerCase())
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
    currentMainIndicator: undefined,

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
            (t) => t.id !== mainIndicatorId
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

    createMainIndicator: async (mainIndicatorData) => {
      try {
        set({ isLoading: true });
        const newMainIndicator = await createMainIndicatorApi(
          mainIndicatorData
        );
        set((state) => {
          const newMainIndicators = [...state.mainIndicators, newMainIndicator];
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
        console.error("Failed to create main indicator:", error);
        set({ isLoading: false });
        throw error;
      }
    },

    updateMainIndicator: async (id, mainIndicatorData) => {
      try {
        set({ isLoading: true });
        const updatedMainIndicator = await updateMainIndicatorApi(
          id,
          mainIndicatorData
        );
        set((state) => {
          const newMainIndicators = state.mainIndicators.map((t) =>
            t.id === id ? updatedMainIndicator : t
          );
          const filtered = filterMainIndicators(
            newMainIndicators,
            state.searchQuery
          );
          return {
            mainIndicators: newMainIndicators,
            filteredMainIndicators: filtered,
            totalMainIndicators: filtered.length,
            currentMainIndicator: updatedMainIndicator,
            isLoading: false,
          };
        });
      } catch (error) {
        console.error("Failed to update main indicator:", error);
        set({ isLoading: false });
        throw error;
      }
    },

    // Loading States
    isLoading: true,
    setLoading: (loading) => set({ isLoading: loading }),
  })
);
