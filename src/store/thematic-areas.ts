import { create } from "zustand";
import type {
  ThematicAreaListItem,
  ThematicAreaDetail,
  ThematicAreaCreateInput,
  ThematicAreaUpdateInput,
  ThematicAreaQueryParams,
} from "@/services/thematic-areas/types";
import { thematicAreaService } from "@/services/thematic-areas/api";
import { urlSync } from "@/utils/url-sync";

interface ThematicAreasState {
  // Data
  thematicAreas: ThematicAreaListItem[];
  totalThematicAreas: number;
  totalPages: number;
  currentThematicArea?: ThematicAreaDetail;

  // Filters & Pagination
  filters: ThematicAreaQueryParams;
  setFilters: (filters: Partial<ThematicAreaQueryParams>) => void;
  resetFilters: () => void;

  // Actions
  addThematicArea: () => void;
  editThematicArea: (thematicArea: ThematicAreaListItem) => void;
  deleteThematicArea: (thematicAreaId: string) => Promise<void>;
  createThematicArea: (thematicArea: ThematicAreaCreateInput) => Promise<void>;
  updateThematicArea: (
    id: string,
    thematicArea: ThematicAreaUpdateInput
  ) => Promise<void>;

  // Loading States
  isTableLoading: boolean;
  isFiltersLoading: boolean;
  isFormLoading: boolean;
  setTableLoading: (loading: boolean) => void;
  setFiltersLoading: (loading: boolean) => void;
  setFormLoading: (loading: boolean) => void;
}

const DEFAULT_FILTERS: ThematicAreaQueryParams = {
  page: 1,
  limit: 10,
  search: "",
};

export const useThematicAreasStore = create<ThematicAreasState>((set) => ({
  // Initial Data
  thematicAreas: [],
  totalThematicAreas: 0,
  totalPages: 0,
  currentThematicArea: undefined,

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
  addThematicArea: () => {
    window.location.href = "/admin/thematic-areas/new";
  },
  editThematicArea: (thematicArea) => {
    window.location.href = `/admin/thematic-areas/${thematicArea.id}/edit`;
  },
  deleteThematicArea: async (thematicAreaId) => {
    await thematicAreaService.delete(thematicAreaId);
    set((state) => ({
      thematicAreas: state.thematicAreas.filter((t) => t.id !== thematicAreaId),
      totalThematicAreas: state.totalThematicAreas - 1,
    }));
  },
  createThematicArea: async (thematicAreaData) => {
    await thematicAreaService.create(thematicAreaData);
    window.location.href = "/admin/thematic-areas";
  },
  updateThematicArea: async (id, thematicAreaData) => {
    await thematicAreaService.update(id, thematicAreaData);
    window.location.href = "/admin/thematic-areas";
  },

  // Loading States
  isTableLoading: false,
  isFiltersLoading: false,
  isFormLoading: false,
  setTableLoading: (loading) => set({ isTableLoading: loading }),
  setFiltersLoading: (loading) => set({ isFiltersLoading: loading }),
  setFormLoading: (loading) => set({ isFormLoading: loading }),
}));
