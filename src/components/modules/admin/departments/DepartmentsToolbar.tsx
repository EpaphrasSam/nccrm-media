"use client";

import { AdminToolbar } from "@/components/modules/admin/layout/AdminToolbar";
import { useDepartmentsStore } from "@/store/departments";

export function DepartmentsToolbar() {
  const { setSearchQuery, addDepartment } = useDepartmentsStore();

  return (
    <AdminToolbar
      searchPlaceholder="Search departments..."
      onSearch={setSearchQuery}
      addButtonLabel="Add Department"
      onAdd={addDepartment}
    />
  );
}
