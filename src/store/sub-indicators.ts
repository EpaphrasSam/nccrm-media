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
import { navigationService } from "@/utils/navigation";

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
    navigationService.navigate("/admin/sub-indicators/new");
  },
  editSubIndicator: (subIndicator) => {
    navigationService.navigate(`/admin/sub-indicators/${subIndicator.id}/edit`);
  },
  deleteSubIndicator: async (subIndicatorId) => {
    try {
      await subIndicatorService.delete(subIndicatorId, false, {
        handleError: (error: string) => {
          console.error("Error deleting sub indicator:", error);
          throw new Error(error);
        },
      });
    } catch {
      // Error has been handled by handleError, we just need to stop execution
      return;
    }
  },
  createSubIndicator: async (subIndicatorData) => {
    try {
      await subIndicatorService.create(subIndicatorData, false, {
        handleError: (error: string) => {
          console.error("Error creating sub indicator:", error);
          throw new Error(error);
        },
      });
      set({
        currentSubIndicator: undefined,
      });
      navigationService.replace("/admin/sub-indicators");
    } catch {
      // Error has been handled by handleError, we just need to stop execution
      return;
    }
  },
  updateSubIndicator: async (id, subIndicatorData) => {
    try {
      await subIndicatorService.update(id, subIndicatorData, false, {
        handleError: (error: string) => {
          console.error("Error updating sub indicator:", error);
          throw new Error(error);
        },
      });
      set({
        totalSubIndicators: 0,
      });
      navigationService.replace("/admin/sub-indicators");
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
