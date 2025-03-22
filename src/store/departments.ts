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
    window.location.href = "/admin/departments/new";
  },
  editDepartment: (department) => {
    window.location.href = `/admin/departments/${department.id}/edit`;
  },
  deleteDepartment: async (departmentId) => {
    await departmentService.delete(departmentId);
    set((state) => ({
      departments: state.departments.filter((d) => d.id !== departmentId),
      totalDepartments: state.totalDepartments - 1,
    }));
  },
  createDepartment: async (departmentData) => {
    await departmentService.create(departmentData);
    window.location.href = "/admin/departments";
  },
  updateDepartment: async (id, departmentData) => {
    await departmentService.update(id, departmentData);
    window.location.href = "/admin/departments";
  },

  // Loading States
  isTableLoading: true,
  isFiltersLoading: false,
  isFormLoading: false,
  setTableLoading: (loading) => set({ isTableLoading: loading }),
  setFiltersLoading: (loading) => set({ isFiltersLoading: loading }),
  setFormLoading: (loading) => set({ isFormLoading: loading }),
}));
