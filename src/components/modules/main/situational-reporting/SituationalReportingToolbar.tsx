"use client";

import { useSituationalReportingStore } from "@/store/situational-reporting";
import { AdminToolbar } from "../../admin/layout/AdminToolbar";

export function SituationalReportingToolbar() {
  const { filters, setFilters, addReport } = useSituationalReportingStore();

  const handleSearch = (query: string) => {
    setFilters({ ...filters, search: query, page: 1 });
  };

  return (
    <AdminToolbar
      searchPlaceholder="Search situational reports..."
      onSearch={handleSearch}
      addButtonLabel="Add Situational Report"
      onAdd={addReport}
    />
  );
}
