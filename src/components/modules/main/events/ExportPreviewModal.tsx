/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
  addToast,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Select,
  SelectItem,
  DateRangePicker,
} from "@heroui/react";
import useSWR from "swr";
import { eventService } from "@/services/events/api";
import type { Event as EventType } from "@/services/events/types";
import { buttonStyles, tableStyles } from "@/lib/styles";
import { Pagination } from "@/components/common/navigation/Pagination";
import { FiFilter, FiX } from "react-icons/fi";
import type { RangeValue } from "@heroui/react";
import { DateValue, parseDate } from "@internationalized/date";

interface ExportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Define available columns for export (adjust as needed)
const ALL_COLUMNS = [
  { key: "id", label: "ID" },
  { key: "reporter.name", label: "Reporter" },
  { key: "report_date", label: "Report Date" },
  { key: "details", label: "Details" },
  { key: "status", label: "Status" },
  { key: "event_date", label: "Event Date" },
  { key: "region", label: "Region" },
  { key: "district", label: "District" },
  { key: "city", label: "City" },
  { key: "coordinates", label: "Coordinates" },
  { key: "location_details", label: "Location Details" },
  {
    key: "sub_indicator.main_indicator.thematic_area.name",
    label: "Thematic Area",
  },
  { key: "sub_indicator.main_indicator.name", label: "Main Indicator" },
  { key: "sub_indicator.name", label: "What" },
  { key: "perpetrator", label: "Perpetrator" },
  { key: "pep_gender", label: "Perpetrator Gender" },
  { key: "pep_age", label: "Perpetrator Age" },
  { key: "pep_occupation", label: "Perpetrator Occupation" },
  { key: "pep_organization", label: "Perpetrator Organization" },
  { key: "pep_note", label: "Perpetrator Notes" },
  { key: "victim", label: "Victim" },
  { key: "victim_gender", label: "Victim Gender" },
  { key: "victim_age", label: "Victim Age" },
  { key: "victim_occupation", label: "Victim Occupation" },
  { key: "victim_organization", label: "Victim Organization" },
  { key: "victim_note", label: "Victim Notes" },
  { key: "death_count_men", label: "Death Count (Men)" },
  { key: "death_count_women_chldren", label: "Death Count (Women/Children)" },
  { key: "death_details", label: "Death Details" },
  { key: "injury_count_men", label: "Injury Count (Men)" },
  { key: "injury_count_women_chldren", label: "Injury Count (Women/Children)" },
  { key: "injury_details", label: "Injury Details" },
  { key: "losses_count", label: "Losses Count" },
  { key: "losses_details", label: "Losses Details" },
  { key: "info_credibility", label: "Information Credibility" },
  { key: "info_source", label: "Information Source" },
  { key: "impact", label: "Impact" },
  { key: "weapons_use", label: "Weapons Used" },
  { key: "context_details", label: "Context Details" },
  { key: "follow_ups", label: "Follow-ups" },
  { key: "created_at", label: "Created At" },
  { key: "updated_at", label: "Updated At" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getNestedValue = (obj: any, path: string): any => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

type FilterState = {
  [key: string]: string[] | (RangeValue<DateValue> | null);
  "reporter.name": string[];
  event_date: RangeValue<DateValue> | null;
  "sub_indicator.main_indicator.thematic_area.name": string[];
  "sub_indicator.main_indicator.name": string[];
  "sub_indicator.name": string[];
  region: string[];
  status: string[];
};

const initialFilters: FilterState = {
  "reporter.name": [],
  event_date: null,
  "sub_indicator.main_indicator.thematic_area.name": [],
  "sub_indicator.main_indicator.name": [],
  "sub_indicator.name": [],
  region: [],
  status: [],
};

export function ExportPreviewModal({
  isOpen,
  onClose,
}: ExportPreviewModalProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  // Fetch ALL events when modal is open
  const {
    data: allEventsData,
    isLoading: isLoadingAllEvents,
    error: fetchError,
  } = useSWR(
    isOpen ? "allEventsExport" : null, // Only fetch when modal is open
    async () => {
      const response = await eventService.fetchAll();
      const data = "data" in response ? response.data : response;
      await new Promise((resolve) => setTimeout(resolve, 100));
      return data.events;
    },
    {
      revalidateOnFocus: false, // Don't refetch on window focus
      shouldRetryOnError: false,
      keepPreviousData: true, // Keep data while loading background updates
    }
  );

  useEffect(() => {
    if (fetchError) {
      addToast({
        title: "Error Fetching Data",
        description: "Could not fetch all events for preview.",
        color: "danger",
      });
      console.error("Error fetching all events:", fetchError);
    }
  }, [fetchError]);

  // Format cell content (memoized for performance)
  const renderCell = useCallback((item: EventType, columnKey: React.Key) => {
    const key = columnKey as string;
    let value = getNestedValue(item, key);

    // Handle specific formatting
    if (key.endsWith("_date") || key.endsWith("_at")) {
      value = value ? new Date(value).toLocaleDateString() : "N/A"; // Simplified date format
    } else if (key === "follow_ups") {
      value = (value || []).join(", ");
    } else if (key === "reporter.name") {
      value = item.reporter?.name || "Unknown"; // Handle potential null reporter
    } else if (key.startsWith("sub_indicator.")) {
      // Example: Handle potentially deep nested sub-indicator fields
      value = getNestedValue(item, key) || "N/A";
    }

    // Default formatting for other types
    if (value === null || value === undefined || value === "") {
      return <span className="text-gray-500 italic text-xs">N/A</span>;
    }

    return <span className="text-xs">{String(value)}</span>;
  }, []);

  // Memoize the columns to render based on selection
  const PREVIEW_COLUMNS = [
    { key: "reporter.name", label: "Reporter" },
    { key: "event_date", label: "Event Date" },
    {
      key: "sub_indicator.main_indicator.thematic_area.name",
      label: "Thematic Area",
    },
    { key: "sub_indicator.main_indicator.name", label: "Main Indicator" },
    { key: "sub_indicator.name", label: "What" },
    { key: "region", label: "Region" },
    { key: "status", label: "Status" },
  ];

  // Add frontend pagination for the preview table
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const filteredEvents = useMemo(() => {
    if (!allEventsData) return [];
    return allEventsData.filter((item) => {
      for (const col of PREVIEW_COLUMNS) {
        const key = col.key;
        if (key === "event_date") {
          const range = filters.event_date as RangeValue<DateValue> | null;
          const value = getNestedValue(item, "event_date");
          // Only use the date part for parseDate
          const dateString = value ? String(value).split("T")[0] : null;
          if (range !== null && range.start && dateString) {
            const date = parseDate(dateString);
            if (date && date.compare(range.start) < 0) return false;
          }
          if (range !== null && range.end && dateString) {
            const date = parseDate(dateString);
            if (date && date.compare(range.end) > 0) return false;
          }
        } else {
          const selected = filters[key] as string[];
          if (selected && selected.length > 0) {
            const value = getNestedValue(item, key);
            if (!selected.includes(String(value))) return false;
          }
        }
      }
      return true;
    });
  }, [allEventsData, filters]);

  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredEvents.slice(start, start + pageSize);
  }, [filteredEvents, currentPage]);

  const handleExport = () => {
    if (!filteredEvents || filteredEvents.length === 0) {
      addToast({
        title: "Nothing to Export",
        description: "No data to export.",
        color: "warning",
      });
      return;
    }
    setIsExporting(true);

    try {
      // Always export all columns and all filtered data
      const headers = ALL_COLUMNS.map((col) => col.label);
      const keys = ALL_COLUMNS.map((col) => col.key);

      const csvData = filteredEvents.map((event: EventType) => {
        const row: Record<
          string,
          string | number | boolean | undefined | null
        > = {};
        keys.forEach((key) => {
          let value = getNestedValue(event, key);
          if (key.endsWith("_date") || key.endsWith("_at")) {
            value = value ? new Date(value).toLocaleString() : "";
          } else if (key === "follow_ups") {
            value = (value || []).join("; ");
          }
          row[key] = value;
        });
        return row;
      });

      const csvRows = [
        headers.map((header) => `"${header}"`).join(","),
        ...csvData.map((row) =>
          keys
            .map((key) => {
              const value = row[key];
              const escapedValue = value?.toString().replace(/"/g, '""') || "";
              return `"${escapedValue}"`;
            })
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
        `events_preview_export_${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      addToast({ title: "Export Successful", color: "success" });
      onClose();
    } catch (error) {
      console.error("Failed to export previewed events:", error);
      addToast({
        title: "Export Failed",
        description: "An error occurred during export.",
        color: "danger",
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Compute unique values for each column
  const uniqueValues = useMemo(() => {
    const result: Record<string, string[]> = {};
    if (!allEventsData) return result;
    PREVIEW_COLUMNS.forEach((col) => {
      if (col.key === "event_date") return;
      const values = Array.from(
        new Set(
          allEventsData.map((item) => {
            const v = getNestedValue(item, col.key);
            return v == null ? "" : String(v);
          })
        )
      ).filter((v) => v !== "");
      result[col.key] = values;
    });
    return result;
  }, [allEventsData]);

  // Handle filter change
  const handleFilterChange = (key: string, values: string[]) => {
    setFilters((prev) => ({ ...prev, [key]: values }));
    setCurrentPage(1);
  };

  const handleDateFilterChange = (range: RangeValue<DateValue> | null) => {
    setFilters((prev) => ({ ...prev, event_date: range }));
    setCurrentPage(1);
  };

  // Helper to get filter label from key
  const getFilterLabel = (key: string) => {
    const col = PREVIEW_COLUMNS.find((c) => c.key === key);
    return col ? col.label : key;
  };

  // Helper to get display value for a filter
  const getFilterDisplay = (key: string, value: unknown) => {
    if (
      key === "event_date" &&
      value &&
      typeof value === "object" &&
      value !== null
    ) {
      const v = value as { start?: DateValue; end?: DateValue };
      const start = v.start ? v.start.toString() : "";
      const end = v.end ? v.end.toString() : "";
      return start && end ? `${start} - ${end}` : start || end;
    }
    if (Array.isArray(value)) return value.join(", ");
    return value as string;
  };

  // Clear a single filter
  const handleClearFilter = (key: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: key === "event_date" ? null : [],
    }));
    setCurrentPage(1);
  };

  // Clear all filters
  const handleClearAllFilters = () => {
    setFilters(initialFilters);
    setCurrentPage(1);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="space-y-1 p-6 pb-2 border-b border-brand-gray-light bg-white flex flex-col gap-2">
          <h1 className="text-title font-extrabold leading-117 text-brand-black">
            Export Preview
          </h1>
          <p className="text-sm-plus font-extrabold leading-117 text-brand-gray">
            Preview the first 7 columns. Export will include all columns.
          </p>
        </ModalHeader>
        <ModalBody className="flex flex-col gap-4 p-2 md:p-6">
          <div className="flex-grow flex flex-col overflow-hidden w-full">
            <div className="px-2 md:px-4 md:sticky md:top-0 md:z-10 md:bg-white md:shadow-sm md:rounded-xl">
              {/* Active Filters Chips */}
              {Object.entries(filters).some(
                ([key, value]) =>
                  (Array.isArray(value) && value.length > 0) ||
                  (key === "event_date" && value)
              ) && (
                <div className="flex flex-wrap gap-2 mb-4 items-center">
                  {Object.entries(filters).map(([key, value]) => {
                    if (
                      (Array.isArray(value) && value.length === 0) ||
                      (key === "event_date" && !value)
                    )
                      return null;
                    return (
                      <div
                        key={key}
                        className="flex items-center bg-brand-gray-light text-brand-black rounded-full px-3 py-1 text-xs font-semibold gap-2"
                      >
                        <span>
                          {getFilterLabel(key)}: {getFilterDisplay(key, value)}
                        </span>
                        <button
                          className="ml-1 text-gray-500 hover:text-red-500 focus:outline-none"
                          onClick={() => handleClearFilter(key)}
                          aria-label={`Clear ${getFilterLabel(key)}`}
                        >
                          <FiX className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                  <button
                    className="ml-2 px-2 py-1 rounded bg-brand-red-dark text-white text-xs font-bold hover:bg-brand-red"
                    onClick={handleClearAllFilters}
                  >
                    Clear All
                  </button>
                </div>
              )}
              {isLoadingAllEvents && !allEventsData ? (
                <div className="flex-grow flex justify-center items-center">
                  <Spinner label="Loading all events..." />
                </div>
              ) : fetchError ? (
                <div className="flex-grow flex justify-center items-center text-danger p-4">
                  Failed to load event data. Please try again later.
                </div>
              ) : (
                <div className="md:max-h-[70vh] md:overflow-y-auto custom-scrollbar bg-white rounded-xl shadow-sm p-2 md:p-4">
                  <Table
                    aria-label="Event export preview table"
                    classNames={tableStyles}
                    isHeaderSticky
                    removeWrapper
                  >
                    <TableHeader columns={PREVIEW_COLUMNS}>
                      {(column) => (
                        <TableColumn
                          key={column.key}
                          className="text-xs-plus font-extrabold text-brand-black md:sticky md:top-0 md:bg-white z-20"
                        >
                          <div className="flex items-center gap-1">
                            {column.label}
                            <Popover placement="bottom-start">
                              <PopoverTrigger>
                                <Button
                                  isIconOnly
                                  variant="light"
                                  size="sm"
                                  className="p-0"
                                >
                                  <FiFilter className="w-3 h-3" color="gray" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="p-4 min-w-[180px]">
                                {column.key === "event_date" ? (
                                  <DateRangePicker
                                    label="Event Date Range"
                                    value={
                                      filters.event_date as RangeValue<DateValue>
                                    }
                                    onChange={handleDateFilterChange}
                                    showMonthAndYearPickers
                                  />
                                ) : (
                                  <Select
                                    label={`Filter ${column.label}`}
                                    placeholder={`Select ${column.label}`}
                                    variant="bordered"
                                    selectionMode="multiple"
                                    selectedKeys={
                                      filters[column.key] as string[]
                                    }
                                    onSelectionChange={(keys) =>
                                      handleFilterChange(
                                        column.key,
                                        Array.from(keys).map((k) => String(k))
                                      )
                                    }
                                    className="w-[250px]"
                                  >
                                    {uniqueValues[column.key]?.map((v) => (
                                      <SelectItem key={v}>{v}</SelectItem>
                                    ))}
                                  </Select>
                                )}
                              </PopoverContent>
                            </Popover>
                          </div>
                        </TableColumn>
                      )}
                    </TableHeader>
                    <TableBody
                      items={paginatedEvents}
                      emptyContent={
                        isLoadingAllEvents ? " " : "No events to preview."
                      }
                      isLoading={isLoadingAllEvents}
                      loadingContent={<Spinner label="Loading..." />}
                    >
                      {(item) => (
                        <TableRow key={item.id}>
                          {(columnKey) => (
                            <TableCell className="align-top text-xs-plus text-brand-black px-2 py-1">
                              {renderCell(item, columnKey)}
                            </TableCell>
                          )}
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                  <Pagination
                    total={Math.ceil(filteredEvents.length / pageSize)}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="bg-white border-t border-brand-gray-light p-4 flex justify-end gap-2">
          <Button
            variant="light"
            onPress={onClose}
            className={`${buttonStyles} text-brand-black bg-brand-gray-light border border-brand-gray-light`}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={handleExport}
            isLoading={isExporting}
            isDisabled={
              isLoadingAllEvents ||
              isExporting ||
              !!fetchError ||
              !filteredEvents ||
              filteredEvents.length === 0
            }
            className={`bg-brand-green-dark text-white ${buttonStyles}`}
          >
            {isExporting ? "Exporting..." : `Export `}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
