"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Select,
  SelectItem,
  Tabs,
  Tab,
  Checkbox,
  Spinner,
  addToast,
} from "@heroui/react";
import { PiMicrosoftExcelLogoThin } from "react-icons/pi";
import { FaChevronLeft } from "react-icons/fa";
import { FiFilter } from "react-icons/fi";
import { useSituationalReportingStore } from "@/store/situational-reporting";
import { navigationService } from "@/utils/navigation";
import { buttonStyles, inputStyles } from "@/lib/styles";
import { urlSync } from "@/utils/url-sync";
import { situationalReportingService } from "@/services/situational-reporting/api";
import type {
  GroupedReports,
  SituationalReport,
} from "@/services/situational-reporting/types";

interface FilterState {
  from: number | undefined;
  to: number | undefined;
}

interface AdvancedFilterState {
  selectedReports: string[];
}

// Generate years from 2000 to current year
const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1999 }, (_, i) =>
  (currentYear - i).toString()
);

export function OverviewHeader() {
  const { overviewFilters, setOverviewFilters, resetOverviewFilters } =
    useSituationalReportingStore();

  const [tempFilters, setTempFilters] = useState<FilterState>({
    from: overviewFilters?.from,
    to: overviewFilters?.to,
  });

  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilterState>({
    selectedReports: overviewFilters?.reports?.split(",") || [],
  });

  const [activeTab, setActiveTab] = useState(
    overviewFilters?.reports ? "advanced" : "basic"
  );

  const [isExporting, setIsExporting] = useState(false);

  // Fetch and group reports using SWR
  const { data: groupedReports = {}, isLoading: isLoadingReports } =
    useSWR<GroupedReports>(
      "reports-for-overview",
      async () => {
        const response = await situationalReportingService.getReports();
        const reports =
          "data" in response
            ? response.data.situationalReports
            : response.situationalReports;

        // Group reports by year
        return reports.reduce(
          (acc: GroupedReports, report: SituationalReport) => {
            const year = report.year.toString();
            if (!acc[year]) {
              acc[year] = [];
            }
            acc[year].push(report);
            return acc;
          },
          {} as GroupedReports
        );
      },
      {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
      }
    );

  const handleApplyFilters = () => {
    if (activeTab === "basic") {
      // Only set filters if both years are provided
      if (tempFilters.from && tempFilters.to) {
        setOverviewFilters({
          from: tempFilters.from,
          to: tempFilters.to,
          reports: undefined, // Clear reports when using basic filters
        });
        urlSync.pushToUrl({
          from: tempFilters.from.toString(),
          to: tempFilters.to.toString(),
        });
      }
    } else {
      // Advanced filters
      if (advancedFilters.selectedReports.length > 0) {
        const reportsString = advancedFilters.selectedReports.join(",");
        setOverviewFilters({
          reports: reportsString,
          from: undefined, // Clear from/to when using advanced filters
          to: undefined,
        });
        urlSync.pushToUrl({
          reports: reportsString,
        });
      }
    }
  };

  const handleClearFilters = () => {
    resetOverviewFilters();
    setTempFilters({ from: undefined, to: undefined });
    setAdvancedFilters({ selectedReports: [] });
    // Clear URL parameters
    urlSync.pushToUrl({});
  };

  const handleReportToggle = (reportId: string) => {
    setAdvancedFilters((prev) => {
      const selected = new Set(prev.selectedReports);
      if (selected.has(reportId)) {
        selected.delete(reportId);
      } else {
        selected.add(reportId);
      }
      return { selectedReports: Array.from(selected) };
    });
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Fetch all situational report summaries
      const response = await situationalReportingService.getAnalysis();
      const data = "data" in response ? response.data : response;
      const years = Object.keys(data);
      if (!years.length) {
        addToast({
          title: "No summary data to export.",
          color: "danger",
        });
        return;
      }
      // Collect all unique thematic areas
      const thematicAreas = Array.from(
        new Set(years.flatMap((year) => Object.keys(data[year] || {})))
      );
      // Prepare CSV headers and rows
      const headers = ["Year", ...thematicAreas];
      const csvRows = [
        headers.join(","),
        ...years.map((year) =>
          [
            year,
            ...thematicAreas.map((area) => {
              const yearData = data[year] as Record<string, number>;
              return yearData && yearData[area] !== undefined
                ? yearData[area]
                : "";
            }),
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
        `situational_overview_export_${
          new Date().toISOString().split("T")[0]
        }.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      addToast({
        title: "Failed to export summary.",
        color: "danger",
      });
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
      <div className="flex items-center gap-4">
        <Button
          color="primary"
          variant="bordered"
          startContent={<FaChevronLeft />}
          onPress={() => navigationService.navigate("/situational-reporting")}
          className={`bg-brand-red-dark text-white px-8 ${buttonStyles}`}
        >
          Back
        </Button>

        <Button
          color="primary"
          startContent={<PiMicrosoftExcelLogoThin className="h-4 w-4" />}
          onPress={handleExport}
          isLoading={isExporting}
          className={`${buttonStyles} bg-brand-green-dark min-w-[48px]`}
        >
          Export
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Popover placement="bottom">
          <PopoverTrigger>
            <Button
              variant="bordered"
              startContent={<FiFilter className="h-4 w-4" />}
              size="md"
              className={`${buttonStyles} bg-brand-red-dark text-white min-w-[48px]`}
            >
              <span className="sm:inline hidden">Filter</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="max-w-[400px]">
            <div className="p-4">
              <Tabs
                selectedKey={activeTab}
                onSelectionChange={(key) => setActiveTab(key.toString())}
                variant="underlined"
                color="danger"
              >
                <Tab key="basic" title="Filters">
                  <div className="space-y-4 mt-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm text-gray-600">From</label>
                      <Select
                        placeholder="Select year"
                        selectedKeys={
                          tempFilters.from ? [tempFilters.from.toString()] : []
                        }
                        onSelectionChange={(keys) => {
                          const value = Array.from(keys)[0]?.toString();
                          setTempFilters({
                            ...tempFilters,
                            from: value ? parseInt(value) : undefined,
                          });
                        }}
                        classNames={inputStyles}
                      >
                        {years.map((year) => (
                          <SelectItem key={year}>{year}</SelectItem>
                        ))}
                      </Select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-sm text-gray-600">To</label>
                      <Select
                        placeholder="Select year"
                        selectedKeys={
                          tempFilters.to ? [tempFilters.to.toString()] : []
                        }
                        onSelectionChange={(keys) => {
                          const value = Array.from(keys)[0]?.toString();
                          setTempFilters({
                            ...tempFilters,
                            to: value ? parseInt(value) : undefined,
                          });
                        }}
                        classNames={inputStyles}
                      >
                        {years.map((year) => (
                          <SelectItem key={year}>{year}</SelectItem>
                        ))}
                      </Select>
                    </div>
                  </div>
                </Tab>
                <Tab key="advanced" title="Advanced Filters">
                  <div className="space-y-4 mt-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                    {isLoadingReports ? (
                      <div>
                        <Spinner />
                      </div>
                    ) : (
                      Object.entries(groupedReports)
                        .sort(([a], [b]) => parseInt(b) - parseInt(a)) // Sort years in descending order
                        .map(([year, reports]) => (
                          <div key={year} className="space-y-2">
                            <h3 className="font-semibold text-base text-gray-500">
                              {year}
                            </h3>
                            <div className="space-y-2 pl-4">
                              {reports.map((report) => (
                                <Checkbox
                                  key={report.id}
                                  isSelected={advancedFilters.selectedReports.includes(
                                    report.id
                                  )}
                                  onValueChange={() =>
                                    handleReportToggle(report.id)
                                  }
                                  color="danger"
                                >
                                  {report.name}
                                </Checkbox>
                              ))}
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </Tab>
              </Tabs>

              <div className="flex gap-2 mt-4">
                <Button
                  variant="light"
                  color="danger"
                  onPress={handleClearFilters}
                  className={`text-[#AC0000] flex-1 ${buttonStyles}`}
                >
                  Clear
                </Button>
                <Button
                  color="primary"
                  onPress={handleApplyFilters}
                  className={`bg-[#AC0000] text-white flex-1 ${buttonStyles}`}
                  isDisabled={
                    (activeTab === "basic" &&
                      (!tempFilters.from || !tempFilters.to)) ||
                    (activeTab === "advanced" &&
                      advancedFilters.selectedReports.length === 0)
                  }
                >
                  Apply
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
