"use client";

import { AdminToolbar } from "@/components/modules/admin/layout/AdminToolbar";
import { useSubIndicatorsStore } from "@/store/sub-indicators";

export function SubIndicatorsToolbar() {
  const { setFilters, addSubIndicator } = useSubIndicatorsStore();

  const handleSearch = (query: string) => {
    setFilters({ search: query, page: 1 }); // Reset to first page on search
  };

  return (
    <AdminToolbar
      searchPlaceholder="Search sub indicators..."
      onSearch={handleSearch}
      addButtonLabel="Add Sub Indicator"
      onAdd={addSubIndicator}
    />
  );
}
