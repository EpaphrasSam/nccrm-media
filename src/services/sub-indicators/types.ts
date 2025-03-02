export interface SubIndicator {
  id: string;
  name: string;
  description: string;
  status: string;
  main_indicator_id: string;
  created_at: string;
  updated_at: string;
}

// For display purposes (like in tables)
export interface SubIndicatorWithMainIndicator extends SubIndicator {
  main_indicator: {
    id: string;
    name: string;
    thematic_area: {
      id: string;
      name: string;
    };
  };
}

// API Response Types
export interface SubIndicatorListResponse {
  message: string;
  subIndicators: SubIndicatorWithMainIndicator[];
  totalSubIndicators: number;
  totalPages: number;
}

export interface SubIndicatorDetailResponse {
  message: string;
  subIndicator: SubIndicatorWithMainIndicator;
}

// Request Types
export interface SubIndicatorCreateInput {
  name: string;
  description: string;
  status: string;
  main_indicator_id: string;
}

export interface SubIndicatorUpdateInput {
  newName?: string;
  newDescription?: string;
  status?: string;
  main_indicator_id?: string;
}

// Query Parameters
export interface SubIndicatorQueryParams {
  page?: number;
  limit?: number;
  main_indicator_id?: string;
  thematic_area_id?: string;
}
