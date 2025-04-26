"use client";

import { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Select,
  SelectItem,
} from "@heroui/react";
import { FiFilter } from "react-icons/fi";
import { useSituationalReportingStore } from "@/store/situational-reporting";
import { buttonStyles, inputStyles } from "@/lib/styles";
import { AdminToolbar } from "../../admin/layout/AdminToolbar";

interface FilterState {
  year: string;
}

// Generate years from 2000 to current year
const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1999 }, (_, i) =>
  (currentYear - i).toString()
);

export function SituationalReportingToolbar() {
  const { filters, setFilters, resetFilters, addReport } =
    useSituationalReportingStore();

  const [tempFilters, setTempFilters] = useState<FilterState>({
    year: filters.year?.toString() || "",
  });

  const handleSearch = (query: string) => {
    setFilters({ ...filters, search: query, page: 1 });
  };

  const handleApplyFilters = () => {
    setFilters({
      ...filters,
      year: tempFilters.year ? parseInt(tempFilters.year) : undefined,
      page: 1,
    });
  };

  const handleClearFilters = () => {
    resetFilters();
    setTempFilters({
      year: "",
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
            className={`${buttonStyles} bg-[#AC0000] text-white min-w-[48px]`}
          >
            <span className="sm:inline hidden">Filter</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="">
          <div className="p-4 flex flex-col items-center gap-4">
            <p className="text-sm-plus text-brand-black font-extrabold self-start">
              Filters
            </p>

            <div className="w-full">
              <label className="text-sm text-gray-600 block mb-2">Year</label>
              <Select
                placeholder="Select year"
                selectedKeys={tempFilters.year ? [tempFilters.year] : []}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0]?.toString() || "";
                  setTempFilters({ year: value });
                }}
                classNames={inputStyles}
              >
                {years.map((year) => (
                  <SelectItem key={year}>{year}</SelectItem>
                ))}
              </Select>
            </div>

            <div className="flex gap-2 w-full">
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
              >
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );

  return (
    <AdminToolbar
      searchPlaceholder="Search situational reports..."
      onSearch={handleSearch}
      addButtonLabel="Add Situational Report"
      onAdd={addReport}
      addPermissionModule="situational_report"
      filterComponent={FilterComponent}
    />
  );
}
