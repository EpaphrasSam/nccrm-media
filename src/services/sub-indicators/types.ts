export type SubIndicatorStatus = "active" | "inactive";

export interface SubIndicator {
  id: string;
  name: string;
  description: string;
  status: SubIndicatorStatus;
  main_indicator_id: string;
  created_at: string;
  updated_at: string;
  main_indicator?: {
    id: string;
    name: string;
    description: string;
    thematic_area: {
      id: string;
      name: string;
    };
  };
}

// Type for list items (used in table/list views)
export interface SubIndicatorListItem extends SubIndicator {
  main_indicator: {
    id: string;
    name: string;
    description: string;
    thematic_area: {
      id: string;
      name: string;
    };
  };
}

// Type for detailed view (used in forms/edit views)
export interface SubIndicatorDetail extends SubIndicator {
  main_indicator: {
    id: string;
    name: string;
    description: string;
    thematic_area: {
      id: string;
      name: string;
    };
  };
}

// Type for creating a new sub indicator
export interface SubIndicatorCreateInput {
  name: string;
  mainIndicator: string;
  status: SubIndicatorStatus;
}

// Type for updating an existing sub indicator
export interface SubIndicatorUpdateInput {
  newName?: string;
  mainIndicator?: string;
  status?: SubIndicatorStatus;
}

// Type for query parameters
export interface SubIndicatorQueryParams {
  page: number;
  limit: number;
  search?: string;
  main_indicator?: string;
}

export interface SubIndicatorListResponse {
  message: string;
  subIndicators: SubIndicatorListItem[];
  totalSubIndicators: number;
  totalPages: number;
}

export interface SubIndicatorDetailResponse {
  message: string;
  subIndicator: SubIndicatorDetail;
}
