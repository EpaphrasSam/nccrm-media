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
import { navigationService } from "@/utils/navigation";
import { storeSync } from "@/lib/store-sync";

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
    navigationService.navigate("/admin/roles/new");
  },
  editRole: (role) => {
    navigationService.navigate(`/admin/roles/${role.id}/edit`);
  },
  deleteRole: async (roleId) => {
    try {
      await roleService.delete(roleId, false, {
        handleError: (error: string) => {
          console.error("Error deleting role:", error);
          throw new Error(error);
        },
      });
      storeSync.trigger();
    } catch {
      // Error has been handled by handleError, we just need to stop execution
      return;
    }
  },
  createRole: async (roleData) => {
    try {
      await roleService.create(roleData, false, {
        handleError: (error: string) => {
          console.error("Error creating role:", error);
          throw new Error(error);
        },
      });
      // Only execute these if no error was thrown
      set({ currentRole: undefined });
      storeSync.trigger();
      navigationService.replace("/admin/roles");
    } catch {
      // Error has been handled by handleError, we just need to stop execution
      return;
    }
  },
  updateRole: async (id, roleData) => {
    try {
      await roleService.update(id, roleData, false, {
        handleError: (error: string) => {
          console.error("Error updating role:", error);
          throw new Error(error);
        },
      });
      // Only execute these if no error was thrown
      set({ currentRole: undefined });
      storeSync.trigger();
      navigationService.replace("/admin/roles");
    } catch {
      // Error has been handled by handleError, we just need to stop execution
      return;
    }
  },

  // Loading States
  isTableLoading: true,
  isFiltersLoading: false,
  isFormLoading: false,
  setTableLoading: (loading) => set({ isTableLoading: loading }),
  setFiltersLoading: (loading) => set({ isFiltersLoading: loading }),
  setFormLoading: (loading) => set({ isFormLoading: loading }),
}));
