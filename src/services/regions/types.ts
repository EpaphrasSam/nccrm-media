// API Response Types
export interface RegionListResponse {
  message: string;
  regions: Region[];
  totalRegions: number;
  totalPages: number;
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

// We'll use Region type directly instead of creating empty interfaces
export type RegionListItem = Region;
export type RegionDetail = Region;

// Request Types
export interface RegionCreateInput {
  name: string;
  status: string;
}

export interface RegionUpdateInput {
  newName?: string;
  status?: string;
}

// Query Parameters
export interface RegionQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}
