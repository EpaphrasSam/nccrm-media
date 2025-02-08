"use client";

import { useState } from "react";
import {
  Select,
  SelectItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from "@heroui/react";
import { FiFilter } from "react-icons/fi";
import { useEventsStore } from "@/store/events";
import { buttonStyles } from "@/lib/styles";
import { AdminToolbar } from "../../admin/layout/AdminToolbar";
import useSWR from "swr";
import { fetchSubIndicators } from "@/services/sub-indicators/api";
import { fetchRegions } from "@/services/regions/api";
import { PiMicrosoftExcelLogoThin } from "react-icons/pi";

export function EventsToolbar() {
  const {
    setSearchQuery,
    setFilters,
    clearFilters,
    addEvent,
    exportToExcel,
    isExporting,
  } = useEventsStore();

  const [tempFilters, setTempFilters] = useState({
    subIndicator: "all",
    region: "all",
  });

  // Fetch sub indicators and regions using SWR
  const { data: subIndicators } = useSWR("subIndicators", fetchSubIndicators);
  const { data: regions } = useSWR("regions", fetchRegions);

  const handleApplyFilters = () => {
    setFilters(tempFilters.subIndicator, tempFilters.region);
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
          >
            <span className="sm:inline hidden">Filter</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="py-4 px-6 space-y-4 w-[350px]">
          <p className="self-start text-sm-plus text-brand-black font-extrabold">
            Filters
          </p>
          <Select
            label="Incident Type"
            placeholder="Select incident type"
            variant="bordered"
            defaultSelectedKeys={["all"]}
            selectedKeys={[tempFilters.subIndicator]}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0]?.toString() || "all";
              setTempFilters({ ...tempFilters, subIndicator: value });
            }}
          >
            {[
              { key: "all", label: "All Incident Types" },
              ...(subIndicators || []).map((indicator) => ({
                key: indicator.id,
                label: indicator.name,
              })),
            ].map(({ key, label }) => (
              <SelectItem key={key}>{label}</SelectItem>
            ))}
          </Select>

          <Select
            label="Region"
            placeholder="Select region"
            variant="bordered"
            defaultSelectedKeys={["all"]}
            selectedKeys={[tempFilters.region]}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0]?.toString() || "all";
              setTempFilters({ ...tempFilters, region: value });
            }}
          >
            {[
              { key: "all", label: "All Regions" },
              ...(regions || []).map((region) => ({
                key: region.id,
                label: region.name,
              })),
            ].map(({ key, label }) => (
              <SelectItem key={key}>{label}</SelectItem>
            ))}
          </Select>

          <div className="flex justify-end gap-2 mt-4 w-full">
            <Button
              variant="light"
              color="danger"
              onPress={() => {
                clearFilters();
                setTempFilters({ subIndicator: "all", region: "all" });
              }}
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
        onPress={exportToExcel}
        startContent={<PiMicrosoftExcelLogoThin className="h-4 w-4" />}
        size="md"
        className={`${buttonStyles} bg-brand-green-dark min-w-[48px]`}
        isLoading={isExporting}
        isDisabled={isExporting}
      >
        <span className="sm:inline hidden">
          {isExporting ? "Exporting..." : "Export Excel"}
        </span>
      </Button>
    </div>
  );

  return (
    <AdminToolbar
      searchPlaceholder="Search events..."
      onSearch={setSearchQuery}
      addButtonLabel="Add Event"
      onAdd={addEvent}
      filterComponent={FilterComponent}
    />
  );
}
