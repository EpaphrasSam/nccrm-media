"use client";

import { AdminToolbar } from "@/components/modules/admin/layout/AdminToolbar";
import { useRegionsStore } from "@/store/regions";

export function RegionsToolbar() {
  const { setSearchQuery, addRegion } = useRegionsStore();

  return (
    <AdminToolbar
      searchPlaceholder="Search regions..."
      onSearch={setSearchQuery}
      addButtonLabel="Add Region"
      onAdd={addRegion}
    />
  );
}
