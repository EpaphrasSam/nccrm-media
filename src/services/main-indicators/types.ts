export type MainIndicatorStatus = "active" | "inactive";

export interface MainIndicator {
  id: string;
  name: string;
  description: string;
  status: MainIndicatorStatus;
  thematic_area_id: string;
  created_at: string;
  updated_at: string;
  thematic_area?: {
    id: string;
    name: string;
  };
}

// Type for list items (used in table/list views)
export interface MainIndicatorListItem extends MainIndicator {
  thematic_area: {
    id: string;
    name: string;
  };
}

// Type for detailed view (used in forms/edit views)
export interface MainIndicatorDetail extends MainIndicator {
  thematic_area: {
    id: string;
    name: string;
  };
}

export interface MainIndicatorListResponse {
  message: string;
  mainIndicators: MainIndicatorListItem[];
  totalMainIndicators: number;
  totalPages: number;
}

export interface MainIndicatorDetailResponse {
  message: string;
  mainIndicator: MainIndicatorDetail;
}

// Type for creating a new main indicator
export interface MainIndicatorCreateInput {
  name: string;
  description: string;
  thematicArea: string;
  status: MainIndicatorStatus;
}

// Type for updating an existing main indicator
export interface MainIndicatorUpdateInput {
  newName?: string;
  newDescription?: string;
  thematicArea?: string;
  status?: MainIndicatorStatus;
}

// Type for query parameters
export interface MainIndicatorQueryParams {
  page: number;
  limit: number;
  search?: string;
  thematic_area?: string;
}
