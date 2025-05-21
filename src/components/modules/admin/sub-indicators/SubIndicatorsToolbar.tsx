"use client";

import { AdminToolbar } from "@/components/modules/admin/layout/AdminToolbar";
import { useSubIndicatorsStore } from "@/store/sub-indicators";
import { useState } from "react";
import { addToast, Button } from "@heroui/react";
import { PiMicrosoftExcelLogoThin } from "react-icons/pi";
import { subIndicatorService } from "@/services/sub-indicators/api";
import { buttonStyles } from "@/lib/styles";

export function SubIndicatorsToolbar() {
  const { setFilters, addSubIndicator } = useSubIndicatorsStore();
  const [isExporting, setIsExporting] = useState(false);

  const handleSearch = (query: string) => {
    setFilters({ search: query, page: 1 }); // Reset to first page on search
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Fetch all sub-indicators (no pagination)
      const response = await subIndicatorService.fetchAll();
      const data = "data" in response ? response.data : response;
      const subIndicators = data.subIndicators || [];
      if (!subIndicators.length) {
        addToast({
          title: "No sub-indicators to export.",
          color: "danger",
        });
        return;
      }
      // Prepare CSV headers and rows
      const headers = [
        "ID",
        "Name",
        "Description",
        "Status",
        "Main Indicator",
        "Thematic Area",
        "Created At",
        "Updated At",
      ];
      const csvRows = [
        headers.join(","),
        ...subIndicators.map((item) =>
          [
            item.id,
            item.name,
            item.description,
            item.status,
            item.main_indicator?.name || "",
            item.main_indicator?.thematic_area?.name || "",
            item.created_at,
            item.updated_at,
          ]
            .map((v) => `"${String(v).replace(/"/g, '""')}"`)
            .join(",")
        ),
      ];
      const BOM = "\uFEFF";
      const csvString = BOM + csvRows.join("\n");
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `sub_indicators_export_${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      addToast({
        title: "Failed to export sub-indicators.",
        color: "danger",
      });
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <AdminToolbar
      searchPlaceholder="Search sub-indicators..."
      onSearch={handleSearch}
      addButtonLabel="Add Sub-indicator"
      onAdd={addSubIndicator}
      addPermissionModule="sub_indicator"
      filterComponent={
        <Button
          color="primary"
          onPress={handleExport}
          startContent={<PiMicrosoftExcelLogoThin className="h-4 w-4" />}
          isLoading={isExporting}
          className={`bg-brand-green-dark min-w-[48px] ${buttonStyles}`}
        >
          <span className="sm:inline hidden">Export</span>
        </Button>
      }
    />
  );
}
