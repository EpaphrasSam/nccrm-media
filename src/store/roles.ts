import { create } from "zustand";
import type {
  RoleListItem,
  RoleDetail,
  RoleCreateInput,
  RoleUpdateInput,
  RoleQueryParams,
} from "@/services/roles/types";
import { roleService } from "@/services/roles/api";
import { urlSync } from "@/utils/url-sync";

interface RolesState {
  // Data
  roles: RoleListItem[];
  totalRoles: number;
  totalPages: number;
  currentRole?: RoleDetail;

  // Filters & Pagination
  filters: RoleQueryParams;
  setFilters: (filters: Partial<RoleQueryParams>) => void;
  resetFilters: () => void;

  // Actions
  addRole: () => void;
  editRole: (role: RoleListItem) => void;
  deleteRole: (roleId: string) => Promise<void>;
  createRole: (role: RoleCreateInput) => Promise<void>;
  updateRole: (id: string, role: RoleUpdateInput) => Promise<void>;

  // Loading States
  isTableLoading: boolean;
  isFiltersLoading: boolean;
  isFormLoading: boolean;
  setTableLoading: (loading: boolean) => void;
  setFiltersLoading: (loading: boolean) => void;
  setFormLoading: (loading: boolean) => void;
}

const DEFAULT_FILTERS: RoleQueryParams = {
  page: 1,
  limit: 10,
  search: "",
};

export const useRolesStore = create<RolesState>((set) => ({
  // Initial Data
  roles: [],
  totalRoles: 0,
  totalPages: 0,
  currentRole: undefined,

  // Filters & Pagination
  filters: DEFAULT_FILTERS,
  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
    urlSync.pushToUrl(newFilters);
  },
  resetFilters: () => {
    set({ filters: DEFAULT_FILTERS });
    urlSync.pushToUrl({});
  },

  // Actions
  addRole: () => {
    window.location.href = "/admin/roles/new";
  },
  editRole: (role) => {
    window.location.href = `/admin/roles/${role.id}/edit`;
  },
  deleteRole: async (roleId) => {
    await roleService.delete(roleId);
    set((state) => ({
      roles: state.roles.filter((r) => r.id !== roleId),
      totalRoles: state.totalRoles - 1,
    }));
  },
  createRole: async (roleData) => {
    await roleService.create(roleData);
    window.location.href = "/admin/roles";
  },
  updateRole: async (id, roleData) => {
    await roleService.update(id, roleData);
    window.location.href = "/admin/roles";
  },

  // Loading States
  isTableLoading: false,
  isFiltersLoading: false,
  isFormLoading: false,
  setTableLoading: (loading) => set({ isTableLoading: loading }),
  setFiltersLoading: (loading) => set({ isFiltersLoading: loading }),
  setFormLoading: (loading) => set({ isFormLoading: loading }),
}));
