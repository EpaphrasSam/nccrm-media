import { create } from "zustand";
import type {
  SituationalReport,
  Analysis,
  SituationalReportCreateInput,
  AnalysisCreateInput,
  SituationalReportQueryParams,
  OverviewSummaryFilters,
} from "@/services/situational-reporting/types";
import { situationalReportingService } from "@/services/situational-reporting/api";
import { urlSync } from "@/utils/url-sync";
import { navigationService } from "@/utils/navigation";
import type { MainIndicator } from "@/services/main-indicators/types";
import type { ThematicArea } from "@/services/thematic-areas/types";

interface SituationalReportingState {
  // Reports Data
  reports: SituationalReport[];
  totalReports: number;
  totalPages: number;
  currentReport?: SituationalReport;

  // Analysis Data
  thematicAreas: ThematicArea[];
  mainIndicators: MainIndicator[];
  currentThematicArea?: string;
  currentMainIndicator?: string;
  currentAnalysis?: Analysis;

  // Filters & Pagination
  filters: SituationalReportQueryParams;
  setFilters: (filters: Partial<SituationalReportQueryParams>) => void;
  resetFilters: () => void;

  // Loading States
  isTableLoading: boolean;
  isFiltersLoading: boolean;
  isFormLoading: boolean;
  isAnalysisLoading: boolean;
  setTableLoading: (loading: boolean) => void;
  setFiltersLoading: (loading: boolean) => void;
  setFormLoading: (loading: boolean) => void;
  setAnalysisLoading: (loading: boolean) => void;

  // Report Actions
  addReport: () => void;
  editReport: (report: SituationalReport) => void;
  deleteReport: (reportId: string) => Promise<void>;
  createReport: (data: SituationalReportCreateInput) => Promise<void>;
  updateReport: (id: string, data: Partial<SituationalReport>) => Promise<void>;

  // Analysis Actions
  setThematicAreas: (thematicAreas: ThematicArea[]) => void;
  setMainIndicators: (indicators: MainIndicator[]) => void;
  setCurrentThematicArea: (id: string) => void;
  setCurrentMainIndicator: (id: string) => void;
  getExistingAnalysis: (
    mainIndicatorId: string,
    reportId: string
  ) => Promise<void>;
  createAnalysis: (data: AnalysisCreateInput) => Promise<void>;
  updateAnalysis: (id: string, data: AnalysisCreateInput) => Promise<void>;

  // Overview Summary Data
  overviewData: {
    [year: string]: {
      [thematicArea: string]: number;
    };
  };
  overviewFilters: OverviewSummaryFilters;
  isOverviewTableLoading: boolean;

  // Overview Summary Actions
  setOverviewData: (data: {
    [year: string]: {
      [thematicArea: string]: number;
    };
  }) => void;
  setOverviewFilters: (filters: Partial<OverviewSummaryFilters>) => void;
  resetOverviewFilters: () => void;
  setOverviewTableLoading: (loading: boolean) => void;
}

const DEFAULT_FILTERS: SituationalReportQueryParams = {
  page: 1,
  limit: 10,
};

const DEFAULT_OVERVIEW_FILTERS: OverviewSummaryFilters = {
  from: undefined,
  to: undefined,
  reports: undefined,
};

export const useSituationalReportingStore = create<SituationalReportingState>(
  (set) => ({
    // Initial Data
    reports: [],
    totalReports: 0,
    totalPages: 0,
    currentReport: undefined,
    thematicAreas: [],
    mainIndicators: [],
    currentThematicArea: undefined,
    currentMainIndicator: undefined,
    currentAnalysis: undefined,

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
    isAnalysisLoading: false,
    setTableLoading: (loading) => set({ isTableLoading: loading }),
    setFiltersLoading: (loading) => set({ isFiltersLoading: loading }),
    setFormLoading: (loading) => set({ isFormLoading: loading }),
    setAnalysisLoading: (loading) => set({ isAnalysisLoading: loading }),

    // Report Actions
    addReport: () => {
      navigationService.navigate("/situational-reporting/new");
    },
    editReport: (report) => {
      set({
        currentThematicArea: undefined,
        currentMainIndicator: undefined,
        currentAnalysis: undefined,
      });
      navigationService.navigate(`/situational-reporting/${report.id}/edit`);
    },
    deleteReport: async (reportId) => {
      try {
        await situationalReportingService.deleteReport(reportId, false, {
          handleError: (error: string) => {
            console.error("Error deleting report:", error);
            throw new Error(error);
          },
        });
        set((state) => ({
          reports: state.reports.filter((r) => r.id !== reportId),
          totalReports: state.totalReports - 1,
        }));
      } catch {
        // Error has been handled by handleError, we just need to stop execution
        return;
      }
    },
    createReport: async (data) => {
      try {
        await situationalReportingService.createReport(data, false, {
          handleError: (error: string) => {
            console.error("Error creating report:", error);
            throw new Error(error);
          },
        });
        navigationService.replace("/situational-reporting");
      } catch {
        // Error has been handled by handleError, we just need to stop execution
        return;
      }
    },
    updateReport: async (id, data) => {
      try {
        await situationalReportingService.updateReport(id, data, false, {
          handleError: (error: string) => {
            console.error("Error updating report:", error);
            throw new Error(error);
          },
        });
        navigationService.replace("/situational-reporting");
      } catch {
        // Error has been handled by handleError, we just need to stop execution
        return;
      }
    },

    // Analysis Actions
    setThematicAreas: (thematicAreas) => set({ thematicAreas }),
    setMainIndicators: (indicators) => set({ mainIndicators: indicators }),
    setCurrentThematicArea: (id) =>
      set({
        currentThematicArea: id,
        currentMainIndicator: undefined, // Reset main indicator when thematic area changes
        currentAnalysis: undefined, // Reset analysis when thematic area changes
      }),
    setCurrentMainIndicator: (id) =>
      set({
        currentMainIndicator: id,
        currentAnalysis: undefined, // Reset analysis when main indicator changes
      }),
    getExistingAnalysis: async (mainIndicatorId, reportId) => {
      set({ isAnalysisLoading: true });
      try {
        const response = await situationalReportingService.getExistingAnalysis(
          mainIndicatorId,
          reportId,
          false,
          {
            handleError: (error: string) => {
              console.error("Error fetching analysis:", error);
              throw new Error(error);
            },
          }
        );
        if (response) {
          const analysis = "data" in response ? response.data : response;
          set({ currentAnalysis: analysis || undefined });
        }
      } catch {
        // Error has been handled by handleError, we just need to stop execution
        return;
      } finally {
        set({ isAnalysisLoading: false });
      }
    },
    createAnalysis: async (data) => {
      try {
        await situationalReportingService.createAnalysis(data, false, {
          handleError: (error: string) => {
            console.error("Error creating analysis:", error);
            throw new Error(error);
          },
        });
        // After successful creation, fetch the latest analysis to refresh the form
        await situationalReportingService
          .getExistingAnalysis(
            data.mainIndicatorId,
            data.situationalReportId,
            false,
            {
              handleError: (error: string) => {
                console.error("Error fetching updated analysis:", error);
                throw new Error(error);
              },
            }
          )
          .then((response) => {
            if (response) {
              const analysis = "data" in response ? response.data : response;
              set({ currentAnalysis: analysis || undefined });
            }
          });
      } catch {
        // Error has been handled by handleError, we just need to stop execution
        return;
      }
    },
    updateAnalysis: async (id, data) => {
      try {
        await situationalReportingService.updateAnalysis(id, data, false, {
          handleError: (error: string) => {
            console.error("Error updating analysis:", error);
            throw new Error(error);
          },
        });
        // After successful update, fetch the latest analysis to refresh the form
        await situationalReportingService
          .getExistingAnalysis(
            data.mainIndicatorId,
            data.situationalReportId,
            false,
            {
              handleError: (error: string) => {
                console.error("Error fetching updated analysis:", error);
                throw new Error(error);
              },
            }
          )
          .then((response) => {
            if (response) {
              const analysis = "data" in response ? response.data : response;
              set({ currentAnalysis: analysis || undefined });
            }
          });
      } catch {
        // Error has been handled by handleError, we just need to stop execution
        return;
      }
    },

    // Overview Summary Initial State
    overviewData: {},
    overviewFilters: DEFAULT_OVERVIEW_FILTERS,
    isOverviewTableLoading: true,

    // Overview Summary Actions
    setOverviewData: (data) => set({ overviewData: data }),
    setOverviewFilters: (newFilters: Partial<OverviewSummaryFilters>) =>
      set((state) => ({
        overviewFilters: { ...state.overviewFilters, ...newFilters },
      })),
    resetOverviewFilters: () =>
      set({ overviewFilters: DEFAULT_OVERVIEW_FILTERS }),
    setOverviewTableLoading: (loading: boolean) =>
      set({ isOverviewTableLoading: loading }),
  })
);
