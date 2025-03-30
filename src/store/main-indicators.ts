import { create } from "zustand";
import type {
  MainIndicatorListItem,
  MainIndicatorDetail,
  MainIndicatorCreateInput,
  MainIndicatorUpdateInput,
  MainIndicatorQueryParams,
} from "@/services/main-indicators/types";
import { mainIndicatorService } from "@/services/main-indicators/api";
import { urlSync } from "@/utils/url-sync";
import { navigationService } from "@/utils/navigation";

interface MainIndicatorsState {
  // Data
  mainIndicators: MainIndicatorListItem[];
  totalMainIndicators: number;
  totalPages: number;
  currentMainIndicator?: MainIndicatorDetail;

  // Filters & Pagination
  filters: MainIndicatorQueryParams;
  setFilters: (filters: Partial<MainIndicatorQueryParams>) => void;
  resetFilters: () => void;

  // Actions
  addMainIndicator: () => void;
  editMainIndicator: (mainIndicator: MainIndicatorListItem) => void;
  deleteMainIndicator: (mainIndicatorId: string) => Promise<void>;
  createMainIndicator: (
    mainIndicator: MainIndicatorCreateInput
  ) => Promise<void>;
  updateMainIndicator: (
    id: string,
    mainIndicator: MainIndicatorUpdateInput
  ) => Promise<void>;

  // Loading States
  isTableLoading: boolean;
  isFiltersLoading: boolean;
  isFormLoading: boolean;
  setTableLoading: (loading: boolean) => void;
  setFiltersLoading: (loading: boolean) => void;
  setFormLoading: (loading: boolean) => void;
}

const DEFAULT_FILTERS: MainIndicatorQueryParams = {
  page: 1,
  limit: 10,
  search: "",
};

export const useMainIndicatorsStore = create<MainIndicatorsState>((set) => ({
  // Initial Data
  mainIndicators: [],
  totalMainIndicators: 0,
  totalPages: 0,
  currentMainIndicator: undefined,

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
  addMainIndicator: () => {
    navigationService.navigate("/admin/main-indicators/new");
  },
  editMainIndicator: (mainIndicator) => {
    navigationService.navigate(
      `/admin/main-indicators/${mainIndicator.id}/edit`
    );
  },
  deleteMainIndicator: async (mainIndicatorId) => {
    try {
      await mainIndicatorService.delete(mainIndicatorId, false, {
        handleError: (error: string) => {
          console.error("Error deleting main indicator:", error);
          throw new Error(error);
        },
      });
    } catch {
      // Error has been handled by handleError, we just need to stop execution
      return;
    }
  },
  createMainIndicator: async (mainIndicatorData) => {
    try {
      await mainIndicatorService.create(mainIndicatorData, false, {
        handleError: (error) => {
          console.error("Error creating main indicator:", error);
          throw new Error(error);
        },
      });
      set({
        currentMainIndicator: undefined,
      });
      navigationService.replace("/admin/main-indicators");
    } catch {
      // Error has been handled by handleError, we just need to stop execution
      return;
    }
  },
  updateMainIndicator: async (id, mainIndicatorData) => {
    try {
      await mainIndicatorService.update(id, mainIndicatorData, false, {
        handleError: (error) => {
          console.error("Error updating main indicator:", error);
          throw new Error(error);
        },
      });
      set({
        currentMainIndicator: undefined,
      });
      navigationService.replace("/admin/main-indicators");
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
