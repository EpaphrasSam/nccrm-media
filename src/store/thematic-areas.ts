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
import { navigationService } from "@/utils/navigation";

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
    navigationService.navigate("/admin/thematic-areas/new");
  },
  editThematicArea: (thematicArea) => {
    navigationService.navigate(`/admin/thematic-areas/${thematicArea.id}/edit`);
  },
  deleteThematicArea: async (thematicAreaId) => {
    try {
      await thematicAreaService.delete(thematicAreaId, false, {
        handleError: (error: string) => {
          console.error("Error deleting thematic area:", error);
          throw new Error(error);
        },
      });
      set((state) => ({
        thematicAreas: state.thematicAreas.filter(
          (t) => t.id !== thematicAreaId
        ),
        totalThematicAreas: state.totalThematicAreas - 1,
      }));
    } catch {
      // Error has been handled by handleError, we just need to stop execution
      return;
    }
  },
  createThematicArea: async (thematicAreaData) => {
    try {
      await thematicAreaService.create(thematicAreaData, false, {
        handleError: (error: string) => {
          console.error("Error creating thematic area:", error);
          throw new Error(error);
        },
      });
      set({
        currentThematicArea: undefined,
        thematicAreas: [],
        totalThematicAreas: 0,
      });
      navigationService.replace("/admin/thematic-areas");
    } catch {
      // Error has been handled by handleError, we just need to stop execution
      return;
    }
  },
  updateThematicArea: async (id, thematicAreaData) => {
    try {
      await thematicAreaService.update(id, thematicAreaData, false, {
        handleError: (error: string) => {
          console.error("Error updating thematic area:", error);
          throw new Error(error);
        },
      });
      set({
        currentThematicArea: undefined,
        thematicAreas: [],
        totalThematicAreas: 0,
      });
      navigationService.replace("/admin/thematic-areas");
    } catch {
      // Error has been handled by handleError, we just need to stop execution
      return;
    }
  },

  // Loading States
  isTableLoading: true,
  isFiltersLoading: false,
  isFormLoading: false,
  setTableLoading: (loading) => set({ isTableLoading: loading }),
  setFiltersLoading: (loading) => set({ isFiltersLoading: loading }),
  setFormLoading: (loading) => set({ isFormLoading: loading }),
}));
