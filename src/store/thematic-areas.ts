import { create } from "zustand";
import { ThematicArea } from "@/services/thematic-areas/types";
import {
  createThematicArea as createThematicAreaApi,
  updateThematicArea as updateThematicAreaApi,
} from "@/services/thematic-areas/api";

interface ThematicAreasState {
  // Data
  thematicAreas: ThematicArea[];
  totalThematicAreas: number;
  filteredThematicAreas: ThematicArea[];
  currentThematicArea?: ThematicArea;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Pagination
  currentPage: number;
  pageSize: number;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;

  // Actions
  addThematicArea: () => void;
  editThematicArea: (thematicArea: ThematicArea) => void;
  deleteThematicArea: (thematicAreaId: string) => Promise<void>;
  createThematicArea: (
    thematicArea: Omit<ThematicArea, "id" | "createdAt">
  ) => Promise<void>;
  updateThematicArea: (
    id: string,
    thematicArea: Partial<ThematicArea>
  ) => Promise<void>;

  // Loading States
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const filterThematicAreas = (
  thematicAreas: ThematicArea[],
  searchQuery: string
) => {
  return thematicAreas.filter((area) => {
    const matchesSearch = searchQuery
      ? area.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        area.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesSearch;
  });
};

export const useThematicAreasStore = create<ThematicAreasState>((set, get) => ({
  // Initial Data
  thematicAreas: [],
  totalThematicAreas: 0,
  filteredThematicAreas: [],
  currentThematicArea: undefined,

  // Search
  searchQuery: "",
  setSearchQuery: (query) => {
    set({ searchQuery: query });
    const state = get();
    const filtered = filterThematicAreas(state.thematicAreas, query);
    set({
      filteredThematicAreas: filtered,
      totalThematicAreas: filtered.length,
      currentPage: 1,
    });
  },

  // Pagination
  currentPage: 1,
  pageSize: 10,
  setCurrentPage: (page) => set({ currentPage: page }),
  setPageSize: (size) => set({ pageSize: size }),

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
      // TODO: Add API call to delete thematic area
      set((state) => {
        const newThematicAreas = state.thematicAreas.filter(
          (t) => t.id !== thematicAreaId
        );
        const filtered = filterThematicAreas(
          newThematicAreas,
          state.searchQuery
        );
        return {
          thematicAreas: newThematicAreas,
          filteredThematicAreas: filtered,
          totalThematicAreas: filtered.length,
          isLoading: false,
        };
      });
    } catch (error) {
      console.error("Failed to delete thematic area:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  createThematicArea: async (thematicAreaData) => {
    try {
      set({ isLoading: true });
      const newThematicArea = await createThematicAreaApi(thematicAreaData);
      set((state) => {
        const newThematicAreas = [...state.thematicAreas, newThematicArea];
        const filtered = filterThematicAreas(
          newThematicAreas,
          state.searchQuery
        );
        return {
          thematicAreas: newThematicAreas,
          filteredThematicAreas: filtered,
          totalThematicAreas: filtered.length,
          isLoading: false,
        };
      });
    } catch (error) {
      console.error("Failed to create thematic area:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  updateThematicArea: async (id, thematicAreaData) => {
    try {
      set({ isLoading: true });
      const updatedThematicArea = await updateThematicAreaApi(
        id,
        thematicAreaData
      );
      set((state) => {
        const newThematicAreas = state.thematicAreas.map((t) =>
          t.id === id ? updatedThematicArea : t
        );
        const filtered = filterThematicAreas(
          newThematicAreas,
          state.searchQuery
        );
        return {
          thematicAreas: newThematicAreas,
          filteredThematicAreas: filtered,
          totalThematicAreas: filtered.length,
          currentThematicArea: updatedThematicArea,
          isLoading: false,
        };
      });
    } catch (error) {
      console.error("Failed to update thematic area:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  // Loading States
  isLoading: true,
  setLoading: (loading) => set({ isLoading: loading }),
}));
