"use client";

import { useRegionsStore } from "@/store/regions";
import { AdminToolbar } from "../layout/AdminToolbar";

export function RegionsToolbar() {
  const { setFilters, addRegion } = useRegionsStore();

  const handleSearch = (query: string) => {
    setFilters({ search: query, page: 1 }); // Reset to first page on search
  };

  return (
    <AdminToolbar
      searchPlaceholder="Search regions..."
      onSearch={handleSearch}
      addButtonLabel="Add Region"
      onAdd={addRegion}
    />
  );
}
