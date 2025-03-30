import { create } from "zustand";
import type {
  DepartmentListItem,
  DepartmentDetail,
  DepartmentCreateInput,
  DepartmentUpdateInput,
  DepartmentQueryParams,
} from "@/services/departments/types";
import { departmentService } from "@/services/departments/api";
import { urlSync } from "@/utils/url-sync";
import { navigationService } from "@/utils/navigation";

interface DepartmentsState {
  // Data
  departments: DepartmentListItem[];
  totalDepartments: number;
  totalPages: number;
  currentDepartment?: DepartmentDetail;

  // Filters & Pagination
  filters: DepartmentQueryParams;
  setFilters: (filters: Partial<DepartmentQueryParams>) => void;
  resetFilters: () => void;

  // Actions
  addDepartment: () => void;
  editDepartment: (department: DepartmentListItem) => void;
  deleteDepartment: (departmentId: string) => Promise<void>;
  createDepartment: (department: DepartmentCreateInput) => Promise<void>;
  updateDepartment: (
    id: string,
    department: DepartmentUpdateInput
  ) => Promise<void>;

  // Loading States
  isTableLoading: boolean;
  isFiltersLoading: boolean;
  isFormLoading: boolean;
  setTableLoading: (loading: boolean) => void;
  setFiltersLoading: (loading: boolean) => void;
  setFormLoading: (loading: boolean) => void;
}

const DEFAULT_FILTERS: DepartmentQueryParams = {
  page: 1,
  limit: 10,
  search: "",
};

export const useDepartmentsStore = create<DepartmentsState>((set) => ({
  // Initial Data
  departments: [],
  totalDepartments: 0,
  totalPages: 0,
  currentDepartment: undefined,

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
  addDepartment: () => {
    navigationService.navigate("/admin/departments/new");
  },
  editDepartment: (department) => {
    navigationService.navigate(`/admin/departments/${department.id}/edit`);
  },
  deleteDepartment: async (departmentId) => {
    try {
      await departmentService.delete(departmentId, false, {
        handleError: (error: string) => {
          console.error("Error deleting department:", error);
          throw new Error(error);
        },
      });
    } catch {
      // Error has been handled by handleError, we just need to stop execution
      return;
    }
  },
  createDepartment: async (departmentData) => {
    try {
      await departmentService.create(departmentData, false, {
        handleError: (error) => {
          console.error("Error creating department:", error);
          throw new Error(error);
        },
      });
      set({
        currentDepartment: undefined,
      });
      navigationService.replace("/admin/departments");
    } catch {
      // Error has been handled by handleError, we just need to stop execution
      return;
    }
  },
  updateDepartment: async (id, departmentData) => {
    try {
      await departmentService.update(id, departmentData, false, {
        handleError: (error) => {
          console.error("Error updating department:", error);
          throw new Error(error);
        },
      });
      set({
        currentDepartment: undefined,
        departments: [],
        totalDepartments: 0,
      });
      navigationService.replace("/admin/departments");
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
