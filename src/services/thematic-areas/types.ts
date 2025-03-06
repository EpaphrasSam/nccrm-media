export interface ThematicArea {
  id: string;
  name: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// API Response Types
export interface ThematicAreaListResponse {
  message: string;
  thematicAreas: ThematicArea[];
  totalThematicAreas: number;
  totalPages: number;
}

// We'll use ThematicArea type directly instead of creating empty interfaces
export type ThematicAreaListItem = ThematicArea;
export type ThematicAreaDetail = ThematicArea;

export interface ThematicAreaDetailResponse {
  message: string;
  thematicArea: ThematicArea;
}

// Request Types
export interface ThematicAreaCreateInput {
  name: string;
  description: string;
  status: string;
}

export interface ThematicAreaUpdateInput {
  newName?: string;
  newDescription?: string;
  status?: string;
}

// Query Parameters
export interface ThematicAreaQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}
