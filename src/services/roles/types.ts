// Base function type without approve
export interface BaseFunctions {
  view: boolean;
  add: boolean;
  edit: boolean;
  delete: boolean;
}

// Extended function type with approve
export interface RoleFunctions extends BaseFunctions {
  approve?: boolean;
}

export interface RolePermissions {
  role: BaseFunctions;
  department: BaseFunctions;
  thematic_area: BaseFunctions;
  main_indicator: BaseFunctions;
  sub_indicator: BaseFunctions;
  event: RoleFunctions;
  user: RoleFunctions;
  situational_report: RoleFunctions;
  situational_analysis: RoleFunctions;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  functions: RolePermissions;
  created_at: string;
  updated_at: string;
}

// Use type aliases instead of interfaces
export type RoleListItem = Role;
export type RoleDetail = Role;

// Type for creating a new role
export interface RoleCreateInput {
  name: string;
  description: string;
  functions: RolePermissions;
}

// Type for updating an existing role
export interface RoleUpdateInput {
  name?: string;
  description?: string;
  functions?: RolePermissions;
}

// Type for query parameters
export interface RoleQueryParams {
  page: number;
  limit: number;
  search?: string;
}

// API Response Types
export interface RoleListResponse {
  message: string;
  roles: RoleListItem[];
  totalRoles: number;
  totalPages: number;
}

export interface RoleDetailResponse {
  message: string;
  role: RoleDetail;
}
