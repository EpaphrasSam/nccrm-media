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
import { storeSync } from "@/lib/store-sync";

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
  isExporting: boolean;

  // Overview Summary Actions
  setOverviewData: (data: {
    [year: string]: {
      [thematicArea: string]: number;
    };
  }) => void;
  setOverviewFilters: (filters: Partial<OverviewSummaryFilters>) => void;
  resetOverviewFilters: () => void;
  setOverviewTableLoading: (loading: boolean) => void;
  exportToExcel: () => Promise<void>;
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
  (set, get) => ({
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
        storeSync.trigger();
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
        storeSync.trigger();
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
        storeSync.trigger();
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
        storeSync.trigger();
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
        storeSync.trigger();
      } catch {
        // Error has been handled by handleError, we just need to stop execution
        return;
      }
    },

    // Overview Summary Initial State
    overviewData: {},
    overviewFilters: DEFAULT_OVERVIEW_FILTERS,
    isOverviewTableLoading: true,
    isExporting: false,

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

    exportToExcel: async () => {
      try {
        set({ isExporting: true });

        // Get current overview data from state
        const { overviewData } = get();

        // Return early if no data
        if (Object.keys(overviewData).length === 0) {
          console.log("No data to export");
          return;
        }

        // Get all unique thematic areas and years
        const thematicAreas = new Set<string>();
        const years = new Set<string>();

        Object.entries(overviewData).forEach(([year, areas]) => {
          years.add(year);
          Object.keys(areas).forEach((area) => thematicAreas.add(area));
        });

        // Sort years descending and thematic areas alphabetically
        const sortedYears = Array.from(years).sort(
          (a, b) => parseInt(b) - parseInt(a)
        );
        const sortedAreas = Array.from(thematicAreas).sort();

        // Create headers row
        const headers = ["Year", ...sortedAreas];

        // Create data rows
        const rows = sortedYears.map((year) => {
          const rowData = [year];
          sortedAreas.forEach((area) => {
            const value = overviewData[year]?.[area] ?? "";
            rowData.push(value.toString());
          });
          return rowData;
        });

        // Convert to CSV
        const csvRows = [
          // Add headers
          headers.map((header) => `"${header}"`).join(","),
          // Add data rows
          ...rows.map((row) => row.map((value) => `"${value}"`).join(",")),
        ];

        // Add BOM and create CSV string
        const BOM = "\uFEFF"; // Add BOM for Excel to auto-expand columns
        const csvString = BOM + csvRows.join("\n");

        // Create and download file
        const blob = new Blob([csvString], {
          type: "text/csv;charset=utf-8;",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `overview_summary_${new Date().toISOString().split("T")[0]}.csv`
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Failed to export overview data:", error);
        throw error;
      } finally {
        set({ isExporting: false });
      }
    },
  })
);
