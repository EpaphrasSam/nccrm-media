"use client";

import { useMainIndicatorsStore } from "@/store/main-indicators";
import { AdminToolbar } from "../layout/AdminToolbar";

export function MainIndicatorsToolbar() {
  const { setFilters, addMainIndicator } = useMainIndicatorsStore();

  const handleSearch = (query: string) => {
    setFilters({ search: query, page: 1 }); // Reset to first page on search
  };

  return (
    <AdminToolbar
      searchPlaceholder="Search main indicators..."
      onSearch={handleSearch}
      addButtonLabel="Add Main Indicator"
      onAdd={addMainIndicator}
      addPermissionModule="main_indicator"
    />
  );
}
