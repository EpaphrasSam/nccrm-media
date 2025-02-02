import { create } from "zustand";
import { User } from "@/services/users/types";

interface UsersState {
  // Data
  users: User[];
  totalUsers: number;
  filteredUsers: User[];

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Filters
  filters: {
    department: string;
    role: string;
  };
  setFilters: (department: string, role: string) => void;
  clearFilters: () => void;

  // Pagination
  currentPage: number;
  pageSize: number;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;

  // Actions
  addUser: () => void;
  editUser: (user: User) => void;
  deleteUser: (userId: string) => Promise<void>;

  // Loading States
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const filterUsers = (
  users: User[],
  searchQuery: string,
  filters: { department: string; role: string }
) => {
  return users.filter((user) => {
    const matchesSearch = searchQuery
      ? user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesDepartment =
      filters.department === "all" || !filters.department
        ? true
        : user.department === filters.department;

    const matchesRole =
      filters.role === "all" || !filters.role
        ? true
        : user.role === filters.role;

    return matchesSearch && matchesDepartment && matchesRole;
  });
};

export const useUsersStore = create<UsersState>((set, get) => ({
  // Initial Data
  users: [],
  totalUsers: 0,
  filteredUsers: [],

  // Search
  searchQuery: "",
  setSearchQuery: (query) => {
    set({ searchQuery: query });
    const state = get();
    const filtered = filterUsers(state.users, query, state.filters);
    set({
      filteredUsers: filtered,
      totalUsers: filtered.length,
      currentPage: 1,
    });
  },

  // Filters
  filters: {
    department: "all",
    role: "all",
  },
  setFilters: (department, role) => {
    set({ filters: { department, role } });
    const state = get();
    const filtered = filterUsers(state.users, state.searchQuery, {
      department,
      role,
    });
    set({
      filteredUsers: filtered,
      totalUsers: filtered.length,
      currentPage: 1,
    });
  },
  clearFilters: () => {
    set({ filters: { department: "all", role: "all" } });
    const state = get();
    const filtered = filterUsers(state.users, state.searchQuery, {
      department: "all",
      role: "all",
    });
    set({
      filteredUsers: filtered,
      totalUsers: filtered.length,
      currentPage: 1,
    });
  },

  // Pagination
  currentPage: 1,
  pageSize: 10,
  setCurrentPage: (page) => set({ currentPage: page }),
  setPageSize: (size) => set({ pageSize: size }),

  // Actions
  addUser: () => {
    window.location.href = "/admin/users/new";
  },
  editUser: (user) => {
    window.location.href = `/admin/users/${user.id}/edit`;
  },
  deleteUser: async (userId) => {
    try {
      set({ isLoading: true });
      // TODO: Add API call to delete user
      set((state) => {
        const newUsers = state.users.filter((u) => u.id !== userId);
        const filtered = filterUsers(
          newUsers,
          state.searchQuery,
          state.filters
        );
        return {
          users: newUsers,
          filteredUsers: filtered,
          totalUsers: filtered.length,
          isLoading: false,
        };
      });
    } catch (error) {
      console.error("Failed to delete user:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  // Loading States
  isLoading: true,
  setLoading: (loading) => set({ isLoading: loading }),
}));
