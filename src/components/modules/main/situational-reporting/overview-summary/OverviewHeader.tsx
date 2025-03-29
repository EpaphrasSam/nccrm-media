"use client";

import { useState } from "react";
import { Button, Popover, PopoverTrigger, PopoverContent } from "@heroui/react";
import { PiMicrosoftExcelLogoThin } from "react-icons/pi";
import { FaChevronLeft } from "react-icons/fa";
import { FiFilter } from "react-icons/fi";
import { useSituationalReportingStore } from "@/store/situational-reporting";
import { navigationService } from "@/utils/navigation";
import { buttonStyles } from "@/lib/styles";
import { urlSync } from "@/utils/url-sync";

interface FilterState {
  from: string;
  to: string;
}

export function OverviewHeader() {
  const { overviewFilters, setOverviewFilters, resetOverviewFilters } =
    useSituationalReportingStore();

  const [tempFilters, setTempFilters] = useState<FilterState>({
    from: overviewFilters?.from || "",
    to: overviewFilters?.to || "",
  });

  const handleApplyFilters = () => {
    // Only set filters if both dates are provided
    if (tempFilters.from && tempFilters.to) {
      setOverviewFilters(tempFilters);
      urlSync.pushToUrl({
        from: tempFilters.from,
        to: tempFilters.to,
      });
    }
  };

  const handleClearFilters = () => {
    resetOverviewFilters();
    setTempFilters({ from: "", to: "" });
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
                  <input
                    type="date"
                    value={tempFilters.from}
                    onChange={(e) =>
                      setTempFilters({ ...tempFilters, from: e.target.value })
                    }
                    className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-600">To</label>
                  <input
                    type="date"
                    value={tempFilters.to}
                    onChange={(e) =>
                      setTempFilters({ ...tempFilters, to: e.target.value })
                    }
                    className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300"
                  />
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
