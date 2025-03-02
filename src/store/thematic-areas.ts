import { create } from "zustand";
import type {
  ThematicArea,
  ThematicAreaCreateInput,
  ThematicAreaUpdateInput,
  ThematicAreaQueryParams,
} from "@/services/thematic-areas/types";
import { thematicAreaService } from "@/services/thematic-areas/api";

interface ThematicAreasState {
  // Data
  thematicAreas: ThematicArea[];
  totalThematicAreas: number;
  totalPages: number;
  currentThematicArea?: ThematicArea;

  // Filters & Pagination
  filters: ThematicAreaQueryParams;
  setFilters: (filters: Partial<ThematicAreaQueryParams>) => void;
  resetFilters: () => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Actions
  addThematicArea: () => void;
  editThematicArea: (thematicArea: ThematicArea) => void;
  deleteThematicArea: (thematicAreaId: string) => Promise<void>;
  createThematicArea: (thematicArea: ThematicAreaCreateInput) => Promise<void>;
  updateThematicArea: (
    id: string,
    thematicArea: ThematicAreaUpdateInput
  ) => Promise<void>;

  // Loading States
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const DEFAULT_FILTERS: ThematicAreaQueryParams = {
  page: 1,
  limit: 20,
};

export const useThematicAreasStore = create<ThematicAreasState>((set) => ({
  // Initial Data
  thematicAreas: [],
  totalThematicAreas: 0,
  totalPages: 0,
  currentThematicArea: undefined,

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
  addThematicArea: () => {
    window.location.href = "/admin/thematic-areas/new";
  },
  editThematicArea: (thematicArea) => {
    window.location.href = `/admin/thematic-areas/${thematicArea.id}/edit`;
  },
  deleteThematicArea: async (thematicAreaId) => {
    try {
      set({ isLoading: true });
      await thematicAreaService.delete(thematicAreaId);
      set((state) => ({
        thematicAreas: state.thematicAreas.filter(
          (t) => t.id !== thematicAreaId
        ),
        totalThematicAreas: state.totalThematicAreas - 1,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Failed to delete thematic area:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  createThematicArea: async (thematicAreaData) => {
    try {
      set({ isLoading: true });
      await thematicAreaService.create(thematicAreaData);
      set({ isLoading: false });
      // Navigate to thematic areas list after creation
      window.location.href = "/admin/thematic-areas";
    } catch (error) {
      console.error("Failed to create thematic area:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  updateThematicArea: async (id, thematicAreaData) => {
    try {
      set({ isLoading: true });
      await thematicAreaService.update(id, thematicAreaData);
      set({ isLoading: false });
      // Navigate to thematic areas list after update
      window.location.href = "/admin/thematic-areas";
    } catch (error) {
      console.error("Failed to update thematic area:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  // Loading States
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
}));
