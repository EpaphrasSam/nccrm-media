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
    window.location.href = "/admin/main-indicators/new";
  },
  editMainIndicator: (mainIndicator) => {
    window.location.href = `/admin/main-indicators/${mainIndicator.id}/edit`;
  },
  deleteMainIndicator: async (mainIndicatorId) => {
    await mainIndicatorService.delete(mainIndicatorId);
    set((state) => ({
      mainIndicators: state.mainIndicators.filter(
        (m) => m.id !== mainIndicatorId
      ),
      totalMainIndicators: state.totalMainIndicators - 1,
    }));
  },
  createMainIndicator: async (mainIndicatorData) => {
    console.log("mainIndicatorData", mainIndicatorData);
    await mainIndicatorService.create(mainIndicatorData);
    window.location.href = "/admin/main-indicators";
  },
  updateMainIndicator: async (id, mainIndicatorData) => {
    await mainIndicatorService.update(id, mainIndicatorData);
    window.location.href = "/admin/main-indicators";
  },

  // Loading States
  isTableLoading: false,
  isFiltersLoading: false,
  isFormLoading: false,
  setTableLoading: (loading) => set({ isTableLoading: loading }),
  setFiltersLoading: (loading) => set({ isFiltersLoading: loading }),
  setFormLoading: (loading) => set({ isFormLoading: loading }),
}));
