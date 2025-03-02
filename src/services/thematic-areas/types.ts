export interface ThematicArea {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  status: string;
}

// API Response Types
export interface ThematicAreaListResponse {
  message: string;
  thematicAreas: ThematicArea[];
}

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
}
