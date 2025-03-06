"use client";

import { useThematicAreasStore } from "@/store/thematic-areas";
import { AdminToolbar } from "../layout/AdminToolbar";

export function ThematicAreasToolbar() {
  const { setFilters, addThematicArea } = useThematicAreasStore();

  const handleSearch = (query: string) => {
    setFilters({ search: query, page: 1 }); // Reset to first page on search
  };

  return (
    <AdminToolbar
      searchPlaceholder="Search thematic areas..."
      onSearch={handleSearch}
      addButtonLabel="Add Thematic Area"
      onAdd={addThematicArea}
    />
  );
}
