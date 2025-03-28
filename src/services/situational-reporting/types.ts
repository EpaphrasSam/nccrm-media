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
  situationalReportsDetails: {
    situationalReports: SituationalReport[];
    totalReports: number;
    totalPages: number;
  };
}

export interface AnalysisResponse {
  message: string;
  existingAnalysis: Analysis | null;
}
