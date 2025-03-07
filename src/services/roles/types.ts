export type ModulePermission = "view" | "edit" | "add" | "delete";

export const MODULE_PERMISSIONS = {
  role: ["view", "edit", "add", "delete"],
  department: ["view", "edit", "add", "delete"],
  region: ["view", "edit", "add", "delete"],
  thematicArea: ["view", "edit", "add", "delete"],
  mainIndicator: ["view", "edit", "add", "delete"],
  subIndicator: ["view", "edit", "add", "delete"],
} as const;

export type ModulePermissions = {
  [K in keyof typeof MODULE_PERMISSIONS]: ModulePermission[];
};

export interface RoleFunctions {
  view: boolean;
  add: boolean;
  edit: boolean;
  delete: boolean;
  approve?: boolean;
}

export interface RolePermissions {
  role: RoleFunctions;
  department: RoleFunctions;
  region: RoleFunctions;
  thematic_area: RoleFunctions;
  main_indicator: RoleFunctions;
  sub_indicator: RoleFunctions;
  event: RoleFunctions & { approve: boolean };
  user: RoleFunctions & { approve: boolean };
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
  newName?: string;
  newDescription?: string;
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
  roles: Role[];
  totalRoles: number;
  totalPages: number;
}

export interface RoleDetailResponse {
  message: string;
  role: Role;
}
