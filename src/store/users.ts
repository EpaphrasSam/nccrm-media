import { create } from "zustand";
import { User } from "@/services/users/types";
import {
  createUser as createUserApi,
  updateUser as updateUserApi,
  deleteUser as deleteUserApi,
  approveUser as approveUserApi,
  rejectUser as rejectUserApi,
} from "@/services/users/api";

interface UsersState {
  // Data
  users: User[];
  totalUsers: number;
  filteredUsers: User[];
  currentUser?: User;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Pagination
  currentPage: number;
  pageSize: number;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;

  // Actions
  addUser: () => void;
  editUser: (user: User) => void;
  deleteUser: (userId: string) => Promise<void>;
  createUser: (
    user: Omit<User, "id" | "createdAt" | "avatarUrl">
  ) => Promise<void>;
  updateUser: (id: string, user: Partial<User>) => Promise<void>;
  approveUser: (userId: string) => Promise<void>;
  rejectUser: (userId: string) => Promise<void>;

  // Loading States
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const filterUsers = (users: User[], searchQuery: string) => {
  return users.filter((user) => {
    const matchesSearch = searchQuery
      ? user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesSearch;
  });
};

export const useUsersStore = create<UsersState>((set, get) => ({
  // Initial Data
  users: [],
  totalUsers: 0,
  filteredUsers: [],
  currentUser: undefined,

  // Search
  searchQuery: "",
  setSearchQuery: (query) => {
    set({ searchQuery: query });
    const state = get();
    const filtered = filterUsers(state.users, query);
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
      await deleteUserApi(userId);
      set((state) => {
        const newUsers = state.users.filter((u) => u.id !== userId);
        const filtered = filterUsers(newUsers, state.searchQuery);
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

  createUser: async (userData) => {
    try {
      set({ isLoading: true });
      const newUser = await createUserApi(userData);
      set((state) => {
        const newUsers = [...state.users, newUser];
        const filtered = filterUsers(newUsers, state.searchQuery);
        return {
          users: newUsers,
          filteredUsers: filtered,
          totalUsers: filtered.length,
          isLoading: false,
        };
      });
    } catch (error) {
      console.error("Failed to create user:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  updateUser: async (id, userData) => {
    try {
      set({ isLoading: true });
      const updatedUser = await updateUserApi(id, userData);
      set((state) => {
        const newUsers = state.users.map((u) =>
          u.id === id ? updatedUser : u
        );
        const filtered = filterUsers(newUsers, state.searchQuery);
        return {
          users: newUsers,
          filteredUsers: filtered,
          totalUsers: filtered.length,
          currentUser: updatedUser,
          isLoading: false,
        };
      });
    } catch (error) {
      console.error("Failed to update user:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  approveUser: async (userId) => {
    try {
      set({ isLoading: true });
      const updatedUser = await approveUserApi(userId);
      set((state) => {
        const newUsers = state.users.map((u) =>
          u.id === userId ? updatedUser : u
        );
        const filtered = filterUsers(newUsers, state.searchQuery);
        return {
          users: newUsers,
          filteredUsers: filtered,
          totalUsers: filtered.length,
          isLoading: false,
        };
      });
    } catch (error) {
      console.error("Failed to approve user:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  rejectUser: async (userId) => {
    try {
      set({ isLoading: true });
      const updatedUser = await rejectUserApi(userId);
      set((state) => {
        const newUsers = state.users.map((u) =>
          u.id === userId ? updatedUser : u
        );
        const filtered = filterUsers(newUsers, state.searchQuery);
        return {
          users: newUsers,
          filteredUsers: filtered,
          totalUsers: filtered.length,
          isLoading: false,
        };
      });
    } catch (error) {
      console.error("Failed to reject user:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  // Loading States
  isLoading: true,
  setLoading: (loading) => set({ isLoading: loading }),
}));
