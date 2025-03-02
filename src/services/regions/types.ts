// API Response Types
export interface RegionListResponse {
  message: string;
  regions: Region[];
}

export interface RegionDetailResponse {
  message: string;
  region: Region;
}

export interface Region {
  id: string;
  name: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// Request Types
export interface RegionCreateInput {
  name: string;
  status: string;
}

export type RegionUpdateInput = {
  newName?: string;
  status?: string;
};

// Query Parameters
export interface RegionQueryParams {
  page?: number;
  limit?: number;
}
