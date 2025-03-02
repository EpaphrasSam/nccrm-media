export type MainIndicatorStatus = "active" | "inactive";

export interface MainIndicator {
  id: string;
  name: string;
  description: string;
  status: string;
  thematic_area_id: string;
  created_at: string;
  updated_at: string;
}

// For display purposes (like in tables)
export interface MainIndicatorWithThematicArea extends MainIndicator {
  thematic_area: {
    id: string;
    name: string;
  };
}

// API Response Types
export interface MainIndicatorListResponse {
  message: string;
  mainIndicators: MainIndicatorWithThematicArea[];
  totalMainIndicators: number;
  totalPages: number;
}

export interface MainIndicatorDetailResponse {
  message: string;
  mainIndicator: MainIndicatorWithThematicArea;
}

// Request Types
export interface MainIndicatorCreateInput {
  name: string;
  description: string;
  status: string;
  thematic_area_id: string;
}

export interface MainIndicatorUpdateInput {
  newName?: string;
  newDescription?: string;
  status?: string;
  thematic_area_id?: string;
}

// Query Parameters
export interface MainIndicatorQueryParams {
  page?: number;
  limit?: number;
  thematic_area_id?: string;
}
