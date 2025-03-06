import { create } from "zustand";
import type {
  RegionListItem,
  RegionDetail,
  RegionCreateInput,
  RegionUpdateInput,
  RegionQueryParams,
} from "@/services/regions/types";
import { regionService } from "@/services/regions/api";
import { urlSync } from "@/utils/url-sync";

interface RegionsState {
  // Data
  regions: RegionListItem[];
  totalRegions: number;
  totalPages: number;
  currentRegion?: RegionDetail;

  // Filters & Pagination
  filters: RegionQueryParams;
  setFilters: (filters: Partial<RegionQueryParams>) => void;
  resetFilters: () => void;

  // Actions
  addRegion: () => void;
  editRegion: (region: RegionListItem) => void;
  deleteRegion: (regionId: string) => Promise<void>;
  createRegion: (region: RegionCreateInput) => Promise<void>;
  updateRegion: (id: string, region: RegionUpdateInput) => Promise<void>;

  // Loading States
  isTableLoading: boolean;
  isFiltersLoading: boolean;
  isFormLoading: boolean;
  setTableLoading: (loading: boolean) => void;
  setFiltersLoading: (loading: boolean) => void;
  setFormLoading: (loading: boolean) => void;
}

const DEFAULT_FILTERS: RegionQueryParams = {
  page: 1,
  limit: 10,
  search: "",
};

export const useRegionsStore = create<RegionsState>((set) => ({
  // Initial Data
  regions: [],
  totalRegions: 0,
  totalPages: 0,
  currentRegion: undefined,

  // Filters & Pagination
  filters: DEFAULT_FILTERS,
  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
    urlSync.pushToUrl(newFilters);
  },
  resetFilters: () => {
    set({ filters: DEFAULT_FILTERS });
    urlSync.pushToUrl({});
  },

  // Actions
  addRegion: () => {
    window.location.href = "/admin/regions/new";
  },
  editRegion: (region) => {
    window.location.href = `/admin/regions/${region.id}/edit`;
  },
  deleteRegion: async (regionId) => {
    await regionService.delete(regionId);
    set((state) => ({
      regions: state.regions.filter((r) => r.id !== regionId),
      totalRegions: state.totalRegions - 1,
    }));
  },
  createRegion: async (regionData) => {
    await regionService.create(regionData);
    window.location.href = "/admin/regions";
  },
  updateRegion: async (id, regionData) => {
    await regionService.update(id, regionData);
    window.location.href = "/admin/regions";
  },

  // Loading States
  isTableLoading: false,
  isFiltersLoading: false,
  isFormLoading: false,
  setTableLoading: (loading) => set({ isTableLoading: loading }),
  setFiltersLoading: (loading) => set({ isFiltersLoading: loading }),
  setFormLoading: (loading) => set({ isFormLoading: loading }),
}));
