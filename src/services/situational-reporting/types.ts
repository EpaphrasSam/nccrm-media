export interface SituationalReport {
  id: string;
  name: string;
  year: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Analysis {
  id: string;
  currentStatus: number;
  escalationPotential: number;
  responseAdequacy: number;
  atRiskGroup: string[];
  comments: string;
  mainIndicatorId: string;
  situationalReportId: string;
  created_at: string;
  updated_at: string;
}

export interface SituationalAnalysis {
  [year: string]: {
    [thematicArea: string]: number;
  };
}

export interface SituationalReportCreateInput {
  name: string;
  year: number;
  status: string;
}

export interface AnalysisCreateInput {
  currentStatus: number;
  escalationPotential: number;
  responseAdequacy: number;
  atRiskGroup: string[];
  comments: string;
  mainIndicatorId: string;
  situationalReportId: string;
}

export interface SituationalReportQueryParams {
  page?: number;
  limit?: number;
  year?: number;
  search?: string;
}

export interface ApiResponse<T> {
  message: string;
  data?: T;
}

export interface SituationalReportsResponse {
  message: string;
  situationalReportsDetails: SituationalReportsDetails;
}

export interface SituationalReportsDetails {
  situationalReports: SituationalReport[];
  totalReports: number;
  totalPages: number;
}

export interface AnalysisResponse {
  message: string;
  existingAnalysis: Analysis | null;
}

export interface OverviewSummaryFilters {
  from?: number;
  to?: number;
  reports?: string; // Comma-separated string of report IDs
}

export interface OverviewSummaryResponse {
  message: string;
  situationalAnalysis: SituationalAnalysis;
}

export interface SubIndicatorStatistic {
  id: string;
  name: string;
  event_count: number;
}

export interface Statistics {
  id: string;
  mainIndicator: string;
  sub_indicators: SubIndicatorStatistic[];
}

export interface StatisticsResponse {
  message: string;
  statistics: Statistics;
}

export interface StatisticsFilters {
  from?: string;
  to?: string;
}

// Add new type for grouped reports
export interface GroupedReports {
  [year: string]: SituationalReport[];
}
