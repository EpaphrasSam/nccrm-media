export interface Department {
  id: string;
  name: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// API Response Types
export interface DepartmentListResponse {
  message: string;
  departments: Department[];
}

export interface DepartmentDetailResponse {
  message: string;
  department: Department;
}

// Request Types
export interface DepartmentCreateInput {
  name: string;
  description: string;
  status: string;
}

export interface DepartmentUpdateInput {
  newName?: string;
  newDescription?: string;
  status?: string;
}

// Query Parameters
export interface DepartmentQueryParams {
  page?: number;
  limit?: number;
}
