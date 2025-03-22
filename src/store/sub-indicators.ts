import { create } from "zustand";
import type {
  SubIndicatorListItem,
  SubIndicatorDetail,
  SubIndicatorCreateInput,
  SubIndicatorUpdateInput,
  SubIndicatorQueryParams,
} from "@/services/sub-indicators/types";
import { subIndicatorService } from "@/services/sub-indicators/api";
import { urlSync } from "@/utils/url-sync";

interface SubIndicatorsState {
  // Data
  subIndicators: SubIndicatorListItem[];
  totalSubIndicators: number;
  totalPages: number;
  currentSubIndicator?: SubIndicatorDetail;

  // Filters & Pagination
  filters: SubIndicatorQueryParams;
  setFilters: (filters: Partial<SubIndicatorQueryParams>) => void;
  resetFilters: () => void;

  // Actions
  addSubIndicator: () => void;
  editSubIndicator: (subIndicator: SubIndicatorListItem) => void;
  deleteSubIndicator: (subIndicatorId: string) => Promise<void>;
  createSubIndicator: (subIndicator: SubIndicatorCreateInput) => Promise<void>;
  updateSubIndicator: (
    id: string,
    subIndicator: SubIndicatorUpdateInput
  ) => Promise<void>;

  // Loading States
  isTableLoading: boolean;
  isFiltersLoading: boolean;
  isFormLoading: boolean;
  setTableLoading: (loading: boolean) => void;
  setFiltersLoading: (loading: boolean) => void;
  setFormLoading: (loading: boolean) => void;
}

const DEFAULT_FILTERS: SubIndicatorQueryParams = {
  page: 1,
  limit: 10,
  search: "",
};

export const useSubIndicatorsStore = create<SubIndicatorsState>((set) => ({
  // Initial Data
  subIndicators: [],
  totalSubIndicators: 0,
  totalPages: 0,
  currentSubIndicator: undefined,

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
  addSubIndicator: () => {
    window.location.href = "/admin/sub-indicators/new";
  },
  editSubIndicator: (subIndicator) => {
    window.location.href = `/admin/sub-indicators/${subIndicator.id}/edit`;
  },
  deleteSubIndicator: async (subIndicatorId) => {
    await subIndicatorService.delete(subIndicatorId);
    set((state) => ({
      subIndicators: state.subIndicators.filter((s) => s.id !== subIndicatorId),
      totalSubIndicators: state.totalSubIndicators - 1,
    }));
  },
  createSubIndicator: async (subIndicatorData) => {
    await subIndicatorService.create(subIndicatorData);
    window.location.href = "/admin/sub-indicators";
  },
  updateSubIndicator: async (id, subIndicatorData) => {
    await subIndicatorService.update(id, subIndicatorData);
    window.location.href = "/admin/sub-indicators";
  },

  // Loading States
  isTableLoading: true,
  isFiltersLoading: false,
  isFormLoading: false,
  setTableLoading: (loading) => set({ isTableLoading: loading }),
  setFiltersLoading: (loading) => set({ isFiltersLoading: loading }),
  setFormLoading: (loading) => set({ isFormLoading: loading }),
}));
