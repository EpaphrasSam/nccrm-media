"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  CheckboxGroup,
  Checkbox,
  Select,
  SelectItem,
  DateRangePicker,
  Spinner,
  addToast,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  ScrollShadow,
  Tabs,
  Tab,
} from "@heroui/react";
import { RangeValue } from "@react-types/shared";
import { DateValue } from "@react-types/datepicker";
import useSWR from "swr";
import { eventService } from "@/services/events/api";
import type { Event as EventType } from "@/services/events/types";
import { buttonStyles, tableStyles } from "@/lib/styles";
import { parseDate } from "@internationalized/date";
import { FiX } from "react-icons/fi";

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
  { key: "sub_indicator.name", label: "Sub Indicator" },
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
  { key: "geo_scope", label: "Geographic Scope" },
  { key: "impact", label: "Impact" },
  { key: "weapons_use", label: "Weapons Used" },
  { key: "context_details", label: "Context Details" },
  { key: "follow_ups", label: "Follow-ups" },
  { key: "created_at", label: "Created At" },
  { key: "updated_at", label: "Updated At" },
];

// Helper to get nested property value
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getNestedValue = (obj: any, path: string): any => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

export function ExportPreviewModal({
  isOpen,
  onClose,
}: ExportPreviewModalProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    ALL_COLUMNS.slice(0, 5).map((col) => col.key) // Default to first 5 columns
  );
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRangeFilter, setDateRangeFilter] =
    useState<RangeValue<DateValue> | null>(null);
  const [activeTab, setActiveTab] = useState<"sidebar" | "table">("table");

  // Derived value for select all
  const selectAll = selectedColumns.length === ALL_COLUMNS.length;

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

  // Memoize filtered data
  const filteredEvents = useMemo(() => {
    if (!allEventsData) return [];

    return allEventsData.filter((event) => {
      // Status Filter
      if (statusFilter !== "all" && event.status !== statusFilter) {
        return false;
      }

      // Date Range Filter (using report_date for this example)
      if (dateRangeFilter?.start && dateRangeFilter?.end) {
        try {
          const eventDate = parseDate(event.report_date.split("T")[0]);
          if (
            eventDate.compare(dateRangeFilter.start) < 0 ||
            eventDate.compare(dateRangeFilter.end) > 0
          ) {
            return false;
          }
        } catch (e) {
          console.warn(
            "Invalid date format for filtering:",
            event.report_date,
            e
          );
          return true; // Or false if invalid dates should be excluded
        }
      }
      return true;
    });
  }, [allEventsData, statusFilter, dateRangeFilter]);

  // Memoize the columns to render based on selection
  const columnsToRender = useMemo(() => {
    return ALL_COLUMNS.filter((col) => selectedColumns.includes(col.key));
  }, [selectedColumns]);

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

  const handleExport = () => {
    if (
      !filteredEvents ||
      filteredEvents.length === 0 ||
      selectedColumns.length === 0
    ) {
      addToast({
        title: "Nothing to Export",
        description:
          "No data matches the current filters or no columns selected.",
        color: "warning",
      });
      return;
    }
    setIsExporting(true);

    try {
      // Get selected column labels and keys in order
      const columnsToExport = ALL_COLUMNS.filter((col) =>
        selectedColumns.includes(col.key)
      );
      const headers = columnsToExport.map((col) => col.label);
      const keys = columnsToExport.map((col) => col.key);

      // Format data for CSV based on selection
      const csvData = filteredEvents.map((event: EventType) => {
        const row: Record<
          string,
          string | number | boolean | undefined | null
        > = {};
        keys.forEach((key) => {
          let value = getNestedValue(event, key);
          // Special handling for dates and arrays
          if (key.endsWith("_date") || key.endsWith("_at")) {
            value = value ? new Date(value).toLocaleString() : "";
          } else if (key === "follow_ups") {
            value = (value || []).join("; ");
          }
          row[key] = value; // Use key temporarily, will map to header later
        });
        return row;
      });

      // Convert to CSV string
      const csvRows = [
        headers.map((header) => `"${header}"`).join(","), // Quoted headers
        ...csvData.map((row) =>
          keys // Use the ordered keys to extract values
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

      // Download file
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

  // Handle select all columns
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedColumns(ALL_COLUMNS.map((col) => col.key));
    } else {
      setSelectedColumns([]);
    }
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
            Select columns and filters, then export your data.
          </p>
        </ModalHeader>
        <ModalBody className="flex flex-col md:flex-row gap-4 md:gap-6 p-2 md:p-6">
          {/* Tabs for mobile */}
          <div className="block md:hidden sticky top-0 z-20 bg-white border-b border-brand-gray-light">
            <Tabs
              selectedKey={activeTab}
              variant="underlined"
              onSelectionChange={(key) =>
                setActiveTab(key as "sidebar" | "table")
              }
            >
              <Tab key="sidebar" title="Filters & Columns" />
              <Tab key="table" title="Table" />
            </Tabs>
          </div>
          {/* Sidebar: filters + columns */}
          <div
            className={
              `w-full md:w-1/4 min-w-[0] md:min-w-[300px] md:max-w-[400px] flex flex-col gap-6 md:border-r h-max md:pr-6 mb-4 md:mb-0 bg-white rounded-xl shadow-sm p-4 md:p-6 ` +
              (activeTab === "sidebar" ? "block" : "hidden") +
              " md:block"
            }
          >
            <h3 className="text-md-plus font-extrabold leading-117 text-brand-black mb-2">
              Filters & Columns
            </h3>
            {/* Filters */}
            <div className="space-y-3">
              <h4 className="text-sm-plus font-extrabold leading-117 text-brand-black mb-1">
                Filter Data
              </h4>
              <Select
                label="Status"
                placeholder="Filter by status"
                variant="bordered"
                selectedKeys={[statusFilter]}
                size="sm"
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0]?.toString() || "all";
                  setStatusFilter(value);
                }}
              >
                <SelectItem key="all">All Statuses</SelectItem>
                <SelectItem key="pending">Pending</SelectItem>
                <SelectItem key="approved">Approved</SelectItem>
                <SelectItem key="rejected">Rejected</SelectItem>
              </Select>
              <DateRangePicker
                label="Report Date Range"
                variant="bordered"
                size="sm"
                value={dateRangeFilter}
                onChange={setDateRangeFilter}
                className="flex-grow"
                showMonthAndYearPickers
                endContent={
                  dateRangeFilter ? (
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      onPress={() => setDateRangeFilter(null)}
                      aria-label="Clear date range"
                      isDisabled={!dateRangeFilter}
                      startContent={<FiX size={16} color="gray" />}
                    />
                  ) : null
                }
              />
            </div>
            {/* Columns */}
            <div className="flex-grow flex flex-col gap-2 mt-6">
              <h4 className="text-sm-plus font-extrabold leading-117 text-brand-black mb-1">
                Select Columns
              </h4>
              <div className="border border-brand-gray-light rounded-lg bg-white p-3">
                <div className="mb-2">
                  <Checkbox
                    isSelected={selectAll}
                    onValueChange={handleSelectAll}
                    size="sm"
                    className="font-medium text-brand-black"
                  >
                    Select All
                  </Checkbox>
                </div>
                <ScrollShadow hideScrollBar className="custom-scrollbar">
                  <CheckboxGroup
                    value={selectedColumns}
                    onValueChange={setSelectedColumns}
                    className="space-y-2"
                  >
                    {ALL_COLUMNS.map((col) => (
                      <Checkbox
                        key={col.key}
                        value={col.key}
                        size="sm"
                        className="font-medium text-brand-black"
                      >
                        {col.label}
                      </Checkbox>
                    ))}
                  </CheckboxGroup>
                </ScrollShadow>
              </div>
            </div>
            {/* Summary */}
            <div className="mt-auto p-3 border border-brand-gray-light rounded-lg bg-white text-sm-plus">
              <h4 className="font-extrabold text-brand-black mb-1">
                Preview Summary
              </h4>
              <p className="text-brand-black">
                Total fetched: {allEventsData?.length ?? 0}
              </p>
              <p className="text-brand-black">
                Showing: {filteredEvents.length}
              </p>
              <p className="text-brand-black">
                Columns: {selectedColumns.length}
              </p>
            </div>
          </div>
          {/* Table */}
          <div
            className={
              `flex-grow flex flex-col overflow-hidden w-full ` +
              (activeTab === "table" ? "block" : "hidden") +
              " md:block"
            }
          >
            <div className="px-2 md:px-4 md:sticky md:top-0 md:z-10 md:bg-white md:shadow-sm md:rounded-xl">
              <>
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
                      <TableHeader columns={columnsToRender}>
                        {(column) => (
                          <TableColumn
                            key={column.key}
                            className="text-xs-plus font-extrabold text-brand-black md:sticky md:top-0 md:bg-white z-20"
                          >
                            {column.label}
                          </TableColumn>
                        )}
                      </TableHeader>
                      <TableBody
                        items={filteredEvents}
                        emptyContent={
                          isLoadingAllEvents
                            ? " "
                            : "No events match the current filters."
                        }
                        isLoading={isLoadingAllEvents}
                        loadingContent={<Spinner label="Applying filters..." />}
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
                  </div>
                )}
              </>
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
            onPress={handleExport}
            isLoading={isExporting}
            isDisabled={
              isLoadingAllEvents ||
              isExporting ||
              !!fetchError ||
              !filteredEvents ||
              filteredEvents.length === 0 ||
              selectedColumns.length === 0
            }
            className={`bg-brand-green-dark text-white ${buttonStyles}`}
          >
            {isExporting
              ? "Exporting..."
              : `Export ${filteredEvents.length} Events`}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
