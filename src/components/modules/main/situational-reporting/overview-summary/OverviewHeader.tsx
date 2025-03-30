"use client";

import { useState } from "react";
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Select,
  SelectItem,
} from "@heroui/react";
import { PiMicrosoftExcelLogoThin } from "react-icons/pi";
import { FaChevronLeft } from "react-icons/fa";
import { FiFilter } from "react-icons/fi";
import { useSituationalReportingStore } from "@/store/situational-reporting";
import { navigationService } from "@/utils/navigation";
import { buttonStyles, inputStyles } from "@/lib/styles";
import { urlSync } from "@/utils/url-sync";

interface FilterState {
  from: number | undefined;
  to: number | undefined;
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

  const handleApplyFilters = () => {
    // Only set filters if both years are provided
    if (tempFilters.from && tempFilters.to) {
      setOverviewFilters(tempFilters);
      urlSync.pushToUrl({
        from: tempFilters.from.toString(),
        to: tempFilters.to.toString(),
      });
    }
  };

  const handleClearFilters = () => {
    resetOverviewFilters();
    setTempFilters({ from: undefined, to: undefined });
    // Clear URL parameters
    urlSync.pushToUrl({});
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
          className={`${buttonStyles} bg-brand-green-dark min-w-[48px]`}
        >
          Export Excel
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
          <PopoverContent className="">
            <div className="p-4 flex flex-col items-center gap-4">
              <p className="text-sm-plus text-brand-black font-extrabold self-start">
                Filters
              </p>

              <div className="w-full space-y-4">
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
    </div>
  );
}
