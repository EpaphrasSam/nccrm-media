"use client";

import { useMainIndicatorsStore } from "@/store/main-indicators";
import { AdminToolbar } from "../layout/AdminToolbar";
import { useState } from "react";
import { addToast, Button } from "@heroui/react";
import { PiMicrosoftExcelLogoThin } from "react-icons/pi";
import { mainIndicatorService } from "@/services/main-indicators/api";
import { buttonStyles } from "@/lib/styles";

export function MainIndicatorsToolbar() {
  const { setFilters, addMainIndicator } = useMainIndicatorsStore();
  const [isExporting, setIsExporting] = useState(false);

  const handleSearch = (query: string) => {
    setFilters({ search: query, page: 1 }); // Reset to first page on search
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Fetch all main indicators (no pagination)
      const response = await mainIndicatorService.fetchAll();
      const data = "data" in response ? response.data : response;
      const mainIndicators = data.mainIndicators || [];
      if (!mainIndicators.length) {
        addToast({
          title: "No main indicators to export.",
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
        "Thematic Area",
        "Created At",
        "Updated At",
      ];
      const csvRows = [
        headers.join(","),
        ...mainIndicators.map((item) =>
          [
            item.id,
            item.name,
            item.description,
            item.status,
            item.thematic_area?.name || "",
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
        `main_indicators_export_${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Failed to export main indicators.");
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <AdminToolbar
      searchPlaceholder="Search main indicators..."
      onSearch={handleSearch}
      addButtonLabel="Add Main Indicator"
      onAdd={addMainIndicator}
      addPermissionModule="main_indicator"
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
