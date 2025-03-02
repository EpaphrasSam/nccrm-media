import { create } from "zustand";
import type {
  Role,
  RoleCreateInput,
  RoleUpdateInput,
} from "@/services/roles/types";
import { roleService } from "@/services/roles/api";

interface RolesState {
  // Data
  roles: Role[];
  totalRoles: number;
  filteredRoles: Role[];
  currentRole?: Role;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Pagination
  currentPage: number;
  pageSize: number;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;

  // Actions
  addRole: () => void;
  editRole: (role: Role) => void;
  deleteRole: (roleId: string) => Promise<void>;
  createRole: (role: RoleCreateInput) => Promise<void>;
  updateRole: (id: string, role: RoleUpdateInput) => Promise<void>;

  // Loading States
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const filterRoles = (roles: Role[], searchQuery: string) => {
  return roles.filter((role) => {
    const matchesSearch = searchQuery
      ? role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesSearch;
  });
};

export const useRolesStore = create<RolesState>((set, get) => ({
  // Initial Data
  roles: [],
  totalRoles: 0,
  filteredRoles: [],
  currentRole: undefined,

  // Search
  searchQuery: "",
  setSearchQuery: (query) => {
    set({ searchQuery: query });
    const state = get();
    const filtered = filterRoles(state.roles, query);
    set({
      filteredRoles: filtered,
      totalRoles: filtered.length,
      currentPage: 1,
    });
  },

  // Pagination
  currentPage: 1,
  pageSize: 10,
  setCurrentPage: (page) => set({ currentPage: page }),
  setPageSize: (size) => set({ pageSize: size }),

  // Actions
  addRole: () => {
    window.location.href = "/admin/roles/new";
  },
  editRole: (role) => {
    window.location.href = `/admin/roles/${role.id}/edit`;
  },
  deleteRole: async (roleId) => {
    try {
      set({ isLoading: true });
      await roleService.delete(roleId);
      set((state) => {
        const newRoles = state.roles.filter((r) => r.id !== roleId);
        const filtered = filterRoles(newRoles, state.searchQuery);
        return {
          roles: newRoles,
          filteredRoles: filtered,
          totalRoles: filtered.length,
          isLoading: false,
        };
      });
      // Navigate to roles list after deletion
      window.location.href = "/admin/roles";
    } catch (error) {
      console.error("Failed to delete role:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  createRole: async (role) => {
    try {
      set({ isLoading: true });
      await roleService.create(role);
      set({ isLoading: false });
      // Navigate to roles list after creation
      window.location.href = "/admin/roles";
    } catch (error) {
      console.error("Failed to create role:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  updateRole: async (id, role) => {
    try {
      set({ isLoading: true });
      await roleService.update(id, role);
      set({ isLoading: false });
      // Navigate to roles list after update
      window.location.href = "/admin/roles";
    } catch (error) {
      console.error("Failed to update role:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  // Loading States
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
}));
