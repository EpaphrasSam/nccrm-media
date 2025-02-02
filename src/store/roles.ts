import { create } from "zustand";
import { Role } from "@/services/roles/types";
import {
  createRole as createRoleApi,
  updateRole as updateRoleApi,
} from "@/services/roles/api";

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
  createRole: (role: Omit<Role, "id" | "createdAt">) => Promise<void>;
  updateRole: (id: string, role: Partial<Role>) => Promise<void>;

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
      // TODO: Add API call to delete role
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
    } catch (error) {
      console.error("Failed to delete role:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  createRole: async (role) => {
    try {
      set({ isLoading: true });
      const newRole = await createRoleApi(role);
      set((state) => {
        const newRoles = [...state.roles, newRole];
        const filtered = filterRoles(newRoles, state.searchQuery);
        return {
          roles: newRoles,
          filteredRoles: filtered,
          totalRoles: filtered.length,
          isLoading: false,
        };
      });
    } catch (error) {
      console.error("Failed to create role:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  updateRole: async (id, role) => {
    try {
      set({ isLoading: true });
      const updatedRole = await updateRoleApi(id, role);
      set((state) => {
        const newRoles = state.roles.map((r) =>
          r.id === id ? updatedRole : r
        );
        const filtered = filterRoles(newRoles, state.searchQuery);
        return {
          roles: newRoles,
          filteredRoles: filtered,
          totalRoles: filtered.length,
          currentRole: updatedRole,
          isLoading: false,
        };
      });
    } catch (error) {
      console.error("Failed to update role:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  // Loading States
  isLoading: true,
  setLoading: (loading) => set({ isLoading: loading }),
}));
