"use client";

import { useState } from "react";
import {
  Select,
  SelectItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Skeleton,
} from "@heroui/react";
import { FiFilter } from "react-icons/fi";
import { useEventsStore } from "@/store/events";
import { buttonStyles } from "@/lib/styles";
import { AdminToolbar } from "../../admin/layout/AdminToolbar";
import { PiMicrosoftExcelLogoThin } from "react-icons/pi";
import useSWR from "swr";
import { ExportPreviewModal } from "./ExportPreviewModal";
import { ThematicArea } from "@/services/thematic-areas/types";
import { EventStatus } from "@/services/events/types";

interface FilterState {
  thematic_area: string;
  status: string;
}

export function EventsToolbar() {
  const { filters, setFilters, resetFilters, addEvent, isFiltersLoading } =
    useEventsStore();

  const [tempFilters, setTempFilters] = useState<FilterState>({
    thematic_area: filters.thematic_area || "all",
    status: filters.status || "all",
  });

  // Get filter options from SWR cache
  const { data: filterOptions } = useSWR<{
    thematicAreas: ThematicArea[];
  }>("filterOptions");
  const thematicAreas = filterOptions?.thematicAreas || [];

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const handleSearch = (query: string) => {
    setFilters({ ...filters, search: query, page: 1 });
  };

  const handleApplyFilters = () => {
    setFilters({
      ...filters,
      thematic_area:
        tempFilters.thematic_area === "all"
          ? undefined
          : tempFilters.thematic_area,
      status:
        tempFilters.status === "all"
          ? undefined
          : (tempFilters.status as EventStatus),
      page: 1,
    });
  };

  const handleClearFilters = () => {
    resetFilters();
    setTempFilters({
      thematic_area: "all",
      status: "all",
    });
  };

  const FilterComponent = (
    <div className="flex items-center gap-2">
      <Popover placement="bottom">
        <PopoverTrigger>
          <Button
            variant="bordered"
            startContent={<FiFilter className="h-4 w-4" />}
            size="md"
            className={`${buttonStyles} bg-brand-red-dark text-white min-w-[48px]`}
            isLoading={isFiltersLoading}
          >
            <span className="sm:inline hidden">Filter</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="py-4 px-6 space-y-4 w-[350px]">
          <p className="self-start text-sm-plus text-brand-black font-extrabold">
            Filters
          </p>

          {isFiltersLoading ? (
            <>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            </>
          ) : (
            <>
              <Select
                label="Thematic Area"
                placeholder="Select thematic area"
                variant="bordered"
                selectedKeys={[tempFilters.thematic_area]}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0]?.toString() || "all";
                  setTempFilters({ ...tempFilters, thematic_area: value });
                }}
              >
                <>
                  <SelectItem key="all">All Thematic Areas</SelectItem>
                  {thematicAreas.map((area) => (
                    <SelectItem key={area.id}>{area.name}</SelectItem>
                  ))}
                </>
              </Select>
              <Select
                label="Status"
                placeholder="Select status"
                variant="bordered"
                selectedKeys={[tempFilters.status]}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0]?.toString() || "all";
                  setTempFilters({ ...tempFilters, status: value });
                }}
                className="mt-4"
              >
                <SelectItem key="all">All Statuses</SelectItem>
                <SelectItem key="pending">Pending</SelectItem>
                <SelectItem key="approved">Approved</SelectItem>
              </Select>
            </>
          )}

          <div className="flex justify-end gap-2 mt-4 w-full">
            <Button
              variant="light"
              color="danger"
              onPress={handleClearFilters}
              className={`text-brand-red-dark w-1/2 ${buttonStyles}`}
            >
              Clear
            </Button>
            <Button
              color="primary"
              onPress={handleApplyFilters}
              className={`bg-brand-red-dark text-white w-1/2 ${buttonStyles}`}
            >
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <Button
        color="primary"
        onPress={() => setIsExportModalOpen(true)}
        startContent={<PiMicrosoftExcelLogoThin className="h-4 w-4" />}
        size="md"
        className={`${buttonStyles} bg-brand-green-dark min-w-[48px]`}
      >
        <span className="sm:inline hidden">Event Summary</span>
      </Button>
    </div>
  );

  return (
    <>
      <AdminToolbar
        searchPlaceholder="Search events..."
        onSearch={handleSearch}
        addButtonLabel="Add Event"
        onAdd={addEvent}
        addPermissionModule="event"
        filterComponent={FilterComponent}
      />
      <ExportPreviewModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </>
  );
}
