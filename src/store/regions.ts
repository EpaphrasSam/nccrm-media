import { create } from "zustand";
import { Region } from "@/services/regions/types";

interface RegionsState {
  // Data
  regions: Region[];
  totalRegions: number;
  filteredRegions: Region[];

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Pagination
  currentPage: number;
  pageSize: number;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;

  // Actions
  addRegion: () => void;
  editRegion: (region: Region) => void;
  deleteRegion: (regionId: string) => Promise<void>;

  // Loading States
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const filterRegions = (regions: Region[], searchQuery: string) => {
  return regions.filter((region) => {
    const matchesSearch = searchQuery
      ? region.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesSearch;
  });
};

export const useRegionsStore = create<RegionsState>((set, get) => ({
  // Initial Data
  regions: [],
  totalRegions: 0,
  filteredRegions: [],

  // Search
  searchQuery: "",
  setSearchQuery: (query) => {
    set({ searchQuery: query });
    const state = get();
    const filtered = filterRegions(state.regions, query);
    set({
      filteredRegions: filtered,
      totalRegions: filtered.length,
      currentPage: 1,
    });
  },

  // Pagination
  currentPage: 1,
  pageSize: 10,
  setCurrentPage: (page) => set({ currentPage: page }),
  setPageSize: (size) => set({ pageSize: size }),

  // Actions
  addRegion: () => {
    window.location.href = "/admin/regions/new";
  },
  editRegion: (region) => {
    window.location.href = `/admin/regions/${region.id}/edit`;
  },
  deleteRegion: async (regionId) => {
    try {
      set({ isLoading: true });
      // TODO: Add API call to delete region
      set((state) => {
        const newRegions = state.regions.filter((r) => r.id !== regionId);
        const filtered = filterRegions(newRegions, state.searchQuery);
        return {
          regions: newRegions,
          filteredRegions: filtered,
          totalRegions: filtered.length,
          isLoading: false,
        };
      });
    } catch (error) {
      console.error("Failed to delete region:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  // Loading States
  isLoading: true,
  setLoading: (loading) => set({ isLoading: loading }),
}));
