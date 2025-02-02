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
  createdAt: string;
  permissions: Partial<ModulePermissions>;
}
