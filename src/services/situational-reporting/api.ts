import { fetchClient } from "@/utils/fetch-client";
import { clientApiCall, serverApiCall } from "@/utils/api-wrapper";
import type {
  SituationalReport,
  SituationalReportCreateInput,
  AnalysisCreateInput,
  SituationalReportQueryParams,
  SituationalReportsResponse,
  SituationalReportsDetails,
  AnalysisResponse,
  SituationalAnalysis,
  OverviewSummaryFilters,
  OverviewSummaryResponse,
  StatisticsResponse,
  StatisticsFilters,
  Statistics,
} from "./types";

type ApiOptions = {
  handleError?: (error: string) => void;
};

export const situationalReportingService = {
  // Report Methods
  getReports(
    params: Partial<SituationalReportQueryParams> = {},
    isServer = false,
    options?: ApiOptions
  ) {
    const promise = fetchClient
      .get<SituationalReportsResponse>("/get-situational-reports", {
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          search: params.search,
          ...(params.year && { year: params.year }),
        },
      })
      .then((res) => res.data)
      .then((data) => data.situationalReportsDetails);

    const defaultResponse: SituationalReportsDetails = {
      situationalReports: [],
      totalReports: 0,
      totalPages: 0,
    };

    return isServer
      ? serverApiCall(promise, defaultResponse)
      : clientApiCall(promise, defaultResponse, false, options);
  },

  getReport(id: string, isServer = false, options?: ApiOptions) {
    const promise = fetchClient
      .get<{ message: string; situationalReport: SituationalReport }>(
        `/get-situational-report/${id}`
      )
      .then((res) => res.data.situationalReport);

    return isServer
      ? serverApiCall(promise, {} as SituationalReport)
      : clientApiCall(promise, {} as SituationalReport, false, options);
  },

  createReport(
    data: SituationalReportCreateInput,
    isServer = false,
    options?: ApiOptions
  ) {
    const promise = fetchClient
      .post<{ message: string }>("/add-situational-report", data)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" }, true, options);
  },

  updateReport(
    id: string,
    data: Partial<SituationalReport>,
    isServer = false,
    options?: ApiOptions
  ) {
    const promise = fetchClient
      .put<{ message: string }>(`/edit-situational-report/${id}`, data)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" }, true, options);
  },

  deleteReport(id: string, isServer = false, options?: ApiOptions) {
    const promise = fetchClient
      .delete<{ message: string }>(`/delete-situational-report/${id}`)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" }, true, options);
  },

  // Analysis Methods
  createAnalysis(
    data: AnalysisCreateInput,
    isServer = false,
    options?: ApiOptions
  ) {
    const promise = fetchClient
      .post<{ message: string }>("/add-situational-analysis", data)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" }, true, options);
  },

  updateAnalysis(
    id: string,
    data: AnalysisCreateInput,
    isServer = false,
    options?: ApiOptions
  ) {
    const promise = fetchClient
      .put<{ message: string }>(`/edit-situational-analysis/${id}`, data)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" }, true, options);
  },

  async getAnalysis(
    params: Partial<OverviewSummaryFilters> = {},
    isServer = false,
    options?: ApiOptions
  ) {
    const promise = fetchClient
      .get<OverviewSummaryResponse>("/get-situational-analysis", {
        params: {
          ...(params.from && { from: params.from }),
          ...(params.to && { to: params.to }),
          ...(params.reports && { reports: params.reports }),
        },
      })
      .then((res) => res.data.situationalAnalysis);

    return isServer
      ? serverApiCall(promise, {} as SituationalAnalysis)
      : clientApiCall(promise, {} as SituationalAnalysis, false, options);
  },

  getExistingAnalysis(
    mainIndicatorId: string,
    reportId: string,
    isServer = false,
    options?: ApiOptions
  ) {
    const promise = fetchClient
      .get<AnalysisResponse>(
        `/get-existing-analysis-on-main-indicator/${mainIndicatorId}/${reportId}`
      )
      .then((res) => res.data.existingAnalysis);

    return isServer
      ? serverApiCall(promise, null)
      : clientApiCall(promise, null, false, options);
  },

  getStatistics(
    mainIndicatorId: string,
    params: Partial<StatisticsFilters> = {},
    isServer = false,
    options?: ApiOptions
  ) {
    const promise = fetchClient
      .get<StatisticsResponse>(`/get-statistics/${mainIndicatorId}`, {
        params: {
          ...(params.from && { from: params.from }),
          ...(params.to && { to: params.to }),
        },
      })
      .then((res) => res.data.statistics);

    const defaultResponse: Statistics = {
      id: "",
      mainIndicator: "",
      sub_indicators: [],
    };

    return isServer
      ? serverApiCall(promise, defaultResponse)
      : clientApiCall(promise, defaultResponse, false, options);
  },
};
