"use client";

import { AdminToolbar } from "@/components/modules/admin/layout/AdminToolbar";
import { useRolesStore } from "@/store/roles";

export function RolesToolbar() {
  const { setSearchQuery, addRole } = useRolesStore();

  return (
    <AdminToolbar
      searchPlaceholder="Search roles..."
      onSearch={setSearchQuery}
      addButtonLabel="Add Role"
      onAdd={addRole}
    />
  );
}
