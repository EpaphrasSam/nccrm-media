"use client";

import { AdminToolbar } from "@/components/modules/admin/layout/AdminToolbar";
import { useMainIndicatorsStore } from "@/store/main-indicators";

export function MainIndicatorsToolbar() {
  const { setSearchQuery, addMainIndicator } = useMainIndicatorsStore();

  return (
    <AdminToolbar
      searchPlaceholder="Search main indicators..."
      onSearch={setSearchQuery}
      addButtonLabel="Add Main Indicator"
      onAdd={addMainIndicator}
    />
  );
}
