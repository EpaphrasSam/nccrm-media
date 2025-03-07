"use client";

import { useRolesStore } from "@/store/roles";
import { AdminToolbar } from "../layout/AdminToolbar";

export function RolesToolbar() {
  const { setFilters, addRole } = useRolesStore();

  const handleSearch = (query: string) => {
    setFilters({ search: query, page: 1 }); // Reset to first page on search
  };

  return (
    <AdminToolbar
      searchPlaceholder="Search roles..."
      onSearch={handleSearch}
      addButtonLabel="Add Role"
      onAdd={addRole}
    />
  );
}
