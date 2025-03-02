import { create } from "zustand";
import type {
  Department,
  DepartmentCreateInput,
  DepartmentUpdateInput,
} from "@/services/departments/types";
import { departmentService } from "@/services/departments/api";

interface DepartmentsState {
  // Data
  departments: Department[];
  totalDepartments: number;
  filteredDepartments: Department[];
  currentDepartment?: Department;

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
  createDepartment: (department: DepartmentCreateInput) => Promise<void>;
  updateDepartment: (
    id: string,
    department: DepartmentUpdateInput
  ) => Promise<void>;

  // Loading States
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const filterDepartments = (departments: Department[], searchQuery: string) => {
  return departments.filter((department) => {
    const matchesSearch = searchQuery
      ? department.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        department.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesSearch;
  });
};

export const useDepartmentsStore = create<DepartmentsState>((set, get) => ({
  // Initial Data
  departments: [],
  totalDepartments: 0,
  filteredDepartments: [],
  currentDepartment: undefined,

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
      await departmentService.delete(departmentId);
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
      // Navigate to departments list after deletion
      window.location.href = "/admin/departments";
    } catch (error) {
      console.error("Failed to delete department:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  createDepartment: async (department) => {
    try {
      set({ isLoading: true });
      await departmentService.create(department);
      set({ isLoading: false });
      // Navigate to departments list after creation
      window.location.href = "/admin/departments";
    } catch (error) {
      console.error("Failed to create department:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  updateDepartment: async (id, department) => {
    try {
      set({ isLoading: true });
      await departmentService.update(id, department);
      set({ isLoading: false });
      // Navigate to departments list after update
      window.location.href = "/admin/departments";
    } catch (error) {
      console.error("Failed to update department:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  // Loading States
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
}));
