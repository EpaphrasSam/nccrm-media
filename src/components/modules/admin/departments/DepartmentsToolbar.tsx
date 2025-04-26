"use client";

import { useDepartmentsStore } from "@/store/departments";
import { AdminToolbar } from "../layout/AdminToolbar";

export function DepartmentsToolbar() {
  const { setFilters, addDepartment } = useDepartmentsStore();

  const handleSearch = (query: string) => {
    setFilters({ search: query, page: 1 }); // Reset to first page on search
  };

  return (
    <AdminToolbar
      searchPlaceholder="Search departments..."
      onSearch={handleSearch}
      addButtonLabel="Add Department"
      onAdd={addDepartment}
      addPermissionModule="department"
    />
  );
}
