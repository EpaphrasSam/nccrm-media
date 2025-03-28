import { create } from "zustand";
import type {
  SituationalReport,
  Analysis,
  SituationalReportCreateInput,
  AnalysisCreateInput,
  SituationalReportQueryParams,
} from "@/services/situational-reporting/types";
import { situationalReportingService } from "@/services/situational-reporting/api";
import { urlSync } from "@/utils/url-sync";
import { navigationService } from "@/utils/navigation";
import type { MainIndicator } from "@/services/main-indicators/types";

interface SituationalReportingState {
  // Reports Data
  reports: SituationalReport[];
  totalReports: number;
  totalPages: number;
  currentReport?: SituationalReport;

  // Analysis Data
  currentAnalysis?: Analysis;
  mainIndicators: MainIndicator[];

  // Filters & Pagination
  filters: SituationalReportQueryParams;
  setFilters: (filters: Partial<SituationalReportQueryParams>) => void;
  resetFilters: () => void;

  // Loading States
  isTableLoading: boolean;
  isFiltersLoading: boolean;
  isFormLoading: boolean;
  setTableLoading: (loading: boolean) => void;
  setFiltersLoading: (loading: boolean) => void;
  setFormLoading: (loading: boolean) => void;

  // Report Actions
  addReport: () => void;
  editReport: (report: SituationalReport) => void;
  deleteReport: (reportId: string) => Promise<void>;
  createReport: (data: SituationalReportCreateInput) => Promise<void>;
  updateReport: (id: string, data: Partial<SituationalReport>) => Promise<void>;

  // Analysis Actions
  setMainIndicators: (indicators: MainIndicator[]) => void;
  createAnalysis: (data: AnalysisCreateInput) => Promise<void>;
  getExistingAnalysis: (
    mainIndicatorId: string,
    reportId: string
  ) => Promise<void>;
}

const DEFAULT_FILTERS: SituationalReportQueryParams = {
  page: 1,
  limit: 10,
  year: new Date().getFullYear(),
};

export const useSituationalReportingStore = create<SituationalReportingState>(
  (set) => ({
    // Initial Data
    reports: [],
    totalReports: 0,
    totalPages: 0,
    currentReport: undefined,
    currentAnalysis: undefined,
    mainIndicators: [],

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

    // Loading States
    isTableLoading: true,
    isFiltersLoading: false,
    isFormLoading: false,
    setTableLoading: (loading) => set({ isTableLoading: loading }),
    setFiltersLoading: (loading) => set({ isFiltersLoading: loading }),
    setFormLoading: (loading) => set({ isFormLoading: loading }),

    // Report Actions
    addReport: () => {
      navigationService.navigate("/situational-reporting/new");
    },
    editReport: (report) => {
      navigationService.navigate(`/situational-reporting/${report.id}/edit`);
    },
    deleteReport: async (reportId) => {
      set({ isTableLoading: true });
      try {
        await situationalReportingService.deleteReport(reportId, false, {
          handleError: (error: string) => {
            console.error("Error deleting report:", error);
          },
        });
        set((state) => ({
          reports: state.reports.filter((r) => r.id !== reportId),
          totalReports: state.totalReports - 1,
        }));
      } finally {
        set({ isTableLoading: false });
      }
    },
    createReport: async (data) => {
      set({ isFormLoading: true });
      try {
        await situationalReportingService.createReport(data, false, {
          handleError: (error: string) => {
            console.error("Error creating report:", error);
          },
        });
        navigationService.navigate("/situational-reporting");
      } finally {
        set({ isFormLoading: false });
      }
    },
    updateReport: async (id, data) => {
      set({ isFormLoading: true });
      try {
        await situationalReportingService.updateReport(id, data, false, {
          handleError: (error: string) => {
            console.error("Error updating report:", error);
          },
        });
        navigationService.navigate("/situational-reporting");
      } finally {
        set({ isFormLoading: false });
      }
    },

    // Analysis Actions
    setMainIndicators: (indicators) => set({ mainIndicators: indicators }),
    createAnalysis: async (data) => {
      set({ isFormLoading: true });
      try {
        await situationalReportingService.createAnalysis(data, false, {
          handleError: (error: string) => {
            console.error("Error creating analysis:", error);
          },
        });
      } finally {
        set({ isFormLoading: false });
      }
    },
    getExistingAnalysis: async (mainIndicatorId, reportId) => {
      set({ isFormLoading: true });
      try {
        const existingAnalysis =
          await situationalReportingService.getExistingAnalysis(
            mainIndicatorId,
            reportId,
            false,
            {
              handleError: (error: string) => {
                console.error("Error fetching analysis:", error);
              },
            }
          );
        if (existingAnalysis) {
          set({ currentAnalysis: existingAnalysis as Analysis });
        }
      } finally {
        set({ isFormLoading: false });
      }
    },
  })
);
