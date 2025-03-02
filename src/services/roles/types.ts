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

export interface Role {
  id: string;
  name: string;
  description: string;
  functions: RoleFunctions;
  created_at: string;
  updated_at: string;
}

// Permission types
export interface Permission {
  view: boolean;
  add: boolean;
  edit: boolean;
  delete: boolean;
}

export interface UserPermission extends Permission {
  approve: boolean;
}

export interface RoleFunctions {
  role: Permission;
  user: UserPermission;
  event: Permission;
  region: Permission;
  department: Permission;
  sub_indicator: Permission;
  thematic_area: Permission;
  main_indicator: Permission;
}

// API Response Types
export interface RoleListResponse {
  message: string;
  roles: Role[];
}

export interface RoleDetailResponse {
  message: string;
  role: Role;
}

// Request Types
export interface RoleCreateInput {
  name: string;
  description: string;
  functions: RoleFunctions;
}

export type RoleUpdateInput = Partial<RoleCreateInput>;

// Query Parameters
export interface RoleQueryParams {
  page?: number;
  limit?: number;
}
