import { create } from "zustand";
import type {
  UserListItem,
  UserDetail,
  UserCreateInput,
  UserUpdateInput,
  UserValidateInput,
  UserQueryParams,
} from "@/services/users/types";
import {
  createUser as createUserApi,
  updateUser as updateUserApi,
  deleteUser as deleteUserApi,
  validateUser as validateUserApi,
} from "@/services/users/api";
import { urlSync } from "@/utils/url-sync";

interface UsersState {
  // Data
  users: UserListItem[];
  totalUsers: number;
  totalPages: number;
  currentUser?: UserDetail;

  // Filters & Pagination
  filters: UserQueryParams;
  setFilters: (filters: Partial<UserQueryParams>) => void;
  resetFilters: () => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Actions
  addUser: () => void;
  editUser: (user: UserListItem) => void;
  deleteUser: (userId: string) => Promise<void>;
  createUser: (user: UserCreateInput) => Promise<void>;
  updateUser: (id: string, user: UserUpdateInput) => Promise<void>;
  validateUser: (userId: string, status: UserValidateInput) => Promise<void>;

  // Loading States
  isTableLoading: boolean;
  isFiltersLoading: boolean;
  isFormLoading: boolean;
  setTableLoading: (loading: boolean) => void;
  setFiltersLoading: (loading: boolean) => void;
  setFormLoading: (loading: boolean) => void;
}

const DEFAULT_FILTERS: UserQueryParams = {
  page: 1,
  limit: 10,
  search: "",
};

export const useUsersStore = create<UsersState>((set) => ({
  // Initial Data
  users: [],
  totalUsers: 0,
  totalPages: 0,
  currentUser: undefined,

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

  // Search
  searchQuery: "",
  setSearchQuery: (query) => {
    set((state) => ({
      filters: { ...state.filters, search: query, page: 1 }, // Reset to first page on search
    }));
    urlSync.pushToUrl({ search: query, page: 1 });
  },

  // Actions
  addUser: () => {
    window.location.href = "/admin/users/new";
  },
  editUser: (user) => {
    window.location.href = `/admin/users/${user.id}/edit`;
  },
  deleteUser: async (userId) => {
    await deleteUserApi(userId);
    set((state) => ({
      users: state.users.filter((u) => u.id !== userId),
      totalUsers: state.totalUsers - 1,
    }));
  },
  createUser: async (userData) => {
    await createUserApi(userData);
    window.location.href = "/admin/users";
  },
  updateUser: async (id, userData) => {
    await updateUserApi(id, userData);
    window.location.href = "/admin/users";
  },
  validateUser: async (userId, status) => {
    await validateUserApi(userId, status);
    window.location.href = "/admin/users";
  },

  // Loading States
  isTableLoading: false,
  isFiltersLoading: false,
  isFormLoading: false,
  setTableLoading: (loading) => set({ isTableLoading: loading }),
  setFiltersLoading: (loading) => set({ isFiltersLoading: loading }),
  setFormLoading: (loading) => set({ isFormLoading: loading }),
}));
