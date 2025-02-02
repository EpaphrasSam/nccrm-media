"use client";

import { AdminToolbar } from "@/components/modules/admin/layout/AdminToolbar";
import { useSubIndicatorsStore } from "@/store/sub-indicators";

export function SubIndicatorsToolbar() {
  const { setSearchQuery, addSubIndicator } = useSubIndicatorsStore();

  return (
    <AdminToolbar
      searchPlaceholder="Search sub indicators..."
      onSearch={setSearchQuery}
      addButtonLabel="Add Sub Indicator"
      onAdd={addSubIndicator}
    />
  );
}
