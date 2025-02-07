import { create } from "zustand";
import { SubIndicatorWithMainIndicator } from "@/services/sub-indicators/types";
import {
  createSubIndicator as createSubIndicatorApi,
  updateSubIndicator as updateSubIndicatorApi,
} from "@/services/sub-indicators/api";

interface SubIndicatorsState {
  // Data
  subIndicators: SubIndicatorWithMainIndicator[];
  totalSubIndicators: number;
  filteredSubIndicators: SubIndicatorWithMainIndicator[];
  currentSubIndicator?: SubIndicatorWithMainIndicator;

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
  editSubIndicator: (subIndicator: SubIndicatorWithMainIndicator) => void;
  deleteSubIndicator: (subIndicatorId: string) => Promise<void>;
  createSubIndicator: (
    subIndicator: Omit<SubIndicatorWithMainIndicator, "id" | "createdAt">
  ) => Promise<void>;
  updateSubIndicator: (
    id: string,
    subIndicator: Partial<SubIndicatorWithMainIndicator>
  ) => Promise<void>;

  // Loading States
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const filterSubIndicators = (
  subIndicators: SubIndicatorWithMainIndicator[],
  searchQuery: string
) => {
  return subIndicators.filter((indicator) => {
    const matchesSearch = searchQuery
      ? indicator.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesSearch;
  });
};

export const useSubIndicatorsStore = create<SubIndicatorsState>((set, get) => ({
  // Initial Data
  subIndicators: [],
  totalSubIndicators: 0,
  filteredSubIndicators: [],
  currentSubIndicator: undefined,

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
          (t) => t.id !== subIndicatorId
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

  createSubIndicator: async (subIndicatorData) => {
    try {
      set({ isLoading: true });
      const newSubIndicator = await createSubIndicatorApi(subIndicatorData);
      set((state) => {
        const newSubIndicators = [...state.subIndicators, newSubIndicator];
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
      console.error("Failed to create sub indicator:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  updateSubIndicator: async (id, subIndicatorData) => {
    try {
      set({ isLoading: true });
      const updatedSubIndicator = await updateSubIndicatorApi(
        id,
        subIndicatorData
      );
      set((state) => {
        const newSubIndicators = state.subIndicators.map((t) =>
          t.id === id ? updatedSubIndicator : t
        );
        const filtered = filterSubIndicators(
          newSubIndicators,
          state.searchQuery
        );
        return {
          subIndicators: newSubIndicators,
          filteredSubIndicators: filtered,
          totalSubIndicators: filtered.length,
          currentSubIndicator: updatedSubIndicator,
          isLoading: false,
        };
      });
    } catch (error) {
      console.error("Failed to update sub indicator:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  // Loading States
  isLoading: true,
  setLoading: (loading) => set({ isLoading: loading }),
}));
