"use client";

import { AdminToolbar } from "../layout/AdminToolbar";
import { useRolesStore } from "@/store/roles";

export function RolesToolbar() {
  const { setFilters, addRole } = useRolesStore();

  const handleSearch = (query: string) => {
    setFilters({ search: query, page: 1 });
  };

  return (
    <AdminToolbar
      searchPlaceholder="Search roles..."
      onSearch={handleSearch}
      addButtonLabel="Add Role"
      onAdd={addRole}
      addPermissionModule="role"
    />
  );
}
