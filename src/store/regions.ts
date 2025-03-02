import { create } from "zustand";
import type {
  Region,
  RegionCreateInput,
  RegionUpdateInput,
  RegionQueryParams,
} from "@/services/regions/types";
import { regionService } from "@/services/regions/api";

interface RegionsState {
  // Data
  regions: Region[];
  totalRegions: number;
  totalPages: number;
  currentRegion?: Region;

  // Filters & Pagination
  filters: RegionQueryParams;
  setFilters: (filters: Partial<RegionQueryParams>) => void;
  resetFilters: () => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Actions
  addRegion: () => void;
  editRegion: (region: Region) => void;
  deleteRegion: (regionId: string) => Promise<void>;
  createRegion: (region: RegionCreateInput) => Promise<void>;
  updateRegion: (id: string, region: RegionUpdateInput) => Promise<void>;

  // Loading States
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const DEFAULT_FILTERS: RegionQueryParams = {
  page: 1,
  limit: 20,
};

export const useRegionsStore = create<RegionsState>((set) => ({
  // Initial Data
  regions: [],
  totalRegions: 0,
  totalPages: 0,
  currentRegion: undefined,

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
  addRegion: () => {
    window.location.href = "/admin/regions/new";
  },
  editRegion: (region) => {
    window.location.href = `/admin/regions/${region.id}/edit`;
  },
  deleteRegion: async (regionId) => {
    try {
      set({ isLoading: true });
      await regionService.delete(regionId);
      set((state) => ({
        regions: state.regions.filter((r) => r.id !== regionId),
        totalRegions: state.totalRegions - 1,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Failed to delete region:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  createRegion: async (regionData) => {
    try {
      set({ isLoading: true });
      await regionService.create(regionData);
      set({ isLoading: false });
      // Navigate to regions list after creation
      window.location.href = "/admin/regions";
    } catch (error) {
      console.error("Failed to create region:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  updateRegion: async (id, regionData) => {
    try {
      set({ isLoading: true });
      await regionService.update(id, regionData);
      set({ isLoading: false });
      // Navigate to regions list after update
      window.location.href = "/admin/regions";
    } catch (error) {
      console.error("Failed to update region:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  // Loading States
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
}));
