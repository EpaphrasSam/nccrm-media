import { create } from "zustand";
import { Department } from "@/services/departments/types";

interface DepartmentsState {
  // Data
  departments: Department[];
  totalDepartments: number;
  filteredDepartments: Department[];

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Pagination
  currentPage: number;
  pageSize: number;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;

  // Actions
  addDepartment: () => void;
  editDepartment: (department: Department) => void;
  deleteDepartment: (departmentId: string) => Promise<void>;

  // Loading States
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const filterDepartments = (departments: Department[], searchQuery: string) => {
  return departments.filter((department) => {
    const matchesSearch = searchQuery
      ? department.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesSearch;
  });
};

export const useDepartmentsStore = create<DepartmentsState>((set, get) => ({
  // Initial Data
  departments: [],
  totalDepartments: 0,
  filteredDepartments: [],

  // Search
  searchQuery: "",
  setSearchQuery: (query) => {
    set({ searchQuery: query });
    const state = get();
    const filtered = filterDepartments(state.departments, query);
    set({
      filteredDepartments: filtered,
      totalDepartments: filtered.length,
      currentPage: 1,
    });
  },

  // Pagination
  currentPage: 1,
  pageSize: 10,
  setCurrentPage: (page) => set({ currentPage: page }),
  setPageSize: (size) => set({ pageSize: size }),

  // Actions
  addDepartment: () => {
    window.location.href = "/admin/departments/new";
  },
  editDepartment: (department) => {
    window.location.href = `/admin/departments/${department.id}/edit`;
  },
  deleteDepartment: async (departmentId) => {
    try {
      set({ isLoading: true });
      // TODO: Add API call to delete department
      set((state) => {
        const newDepartments = state.departments.filter(
          (d) => d.id !== departmentId
        );
        const filtered = filterDepartments(newDepartments, state.searchQuery);
        return {
          departments: newDepartments,
          filteredDepartments: filtered,
          totalDepartments: filtered.length,
          isLoading: false,
        };
      });
    } catch (error) {
      console.error("Failed to delete department:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  // Loading States
  isLoading: true,
  setLoading: (loading) => set({ isLoading: loading }),
}));
