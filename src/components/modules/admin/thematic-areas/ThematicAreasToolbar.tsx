"use client";

import { AdminToolbar } from "@/components/modules/admin/layout/AdminToolbar";
import { useThematicAreasStore } from "@/store/thematic-areas";

export function ThematicAreasToolbar() {
  const { setSearchQuery, addThematicArea } = useThematicAreasStore();

  return (
    <AdminToolbar
      searchPlaceholder="Search thematic areas..."
      onSearch={setSearchQuery}
      addButtonLabel="Add Thematic Area"
      onAdd={addThematicArea}
    />
  );
}
