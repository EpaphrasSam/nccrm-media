import { create } from "zustand";
import { Region } from "@/services/regions/types";
import {
  createRegion as createRegionApi,
  updateRegion as updateRegionApi,
} from "@/services/regions/api";

interface RegionsState {
  // Data
  regions: Region[];
  totalRegions: number;
  filteredRegions: Region[];
  currentRegion?: Region;

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
  createRegion: (region: Omit<Region, "id" | "createdAt">) => Promise<void>;
  updateRegion: (id: string, region: Partial<Region>) => Promise<void>;

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
  currentRegion: undefined,

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

  createRegion: async (regionData) => {
    try {
      set({ isLoading: true });
      const newRegion = await createRegionApi(regionData);
      set((state) => {
        const newRegions = [...state.regions, newRegion];
        const filtered = filterRegions(newRegions, state.searchQuery);
        return {
          regions: newRegions,
          filteredRegions: filtered,
          totalRegions: filtered.length,
          isLoading: false,
        };
      });
    } catch (error) {
      console.error("Failed to create region:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  updateRegion: async (id, regionData) => {
    try {
      set({ isLoading: true });
      const updatedRegion = await updateRegionApi(id, regionData);
      set((state) => {
        const newRegions = state.regions.map((r) =>
          r.id === id ? updatedRegion : r
        );
        const filtered = filterRegions(newRegions, state.searchQuery);
        return {
          regions: newRegions,
          filteredRegions: filtered,
          totalRegions: filtered.length,
          currentRegion: updatedRegion,
          isLoading: false,
        };
      });
    } catch (error) {
      console.error("Failed to update region:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  // Loading States
  isLoading: true,
  setLoading: (loading) => set({ isLoading: loading }),
}));
