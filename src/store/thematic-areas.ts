import { create } from "zustand";
import { ThematicArea } from "@/services/thematic-areas/types";

interface ThematicAreasState {
  // Data
  thematicAreas: ThematicArea[];
  totalThematicAreas: number;
  filteredThematicAreas: ThematicArea[];

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
        const newAreas = state.thematicAreas.filter(
          (a) => a.id !== thematicAreaId
        );
        const filtered = filterThematicAreas(newAreas, state.searchQuery);
        return {
          thematicAreas: newAreas,
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

  // Loading States
  isLoading: true,
  setLoading: (loading) => set({ isLoading: loading }),
}));
