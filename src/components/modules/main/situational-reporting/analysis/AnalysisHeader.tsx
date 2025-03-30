"use client";

import { buttonStyles } from "@/lib/styles";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
} from "@heroui/react";
import { useState } from "react";
import { situationalReportingService } from "@/services/situational-reporting/api";
import type {
  Statistics,
  SubIndicatorStatistic,
} from "@/services/situational-reporting/types";
import { useSituationalReportingStore } from "@/store/situational-reporting";
import useSWR from "swr";

export function AnalysisHeader() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const currentMainIndicator = useSituationalReportingStore(
    (state) => state.currentMainIndicator
  );

  const clearFilters = () => {
    setFromDate("");
    setToDate("");
  };

  const fetcher = async (
    key: string,
    params: { from?: string; to?: string }
  ): Promise<Statistics> => {
    const response = await situationalReportingService.getStatistics(
      key,
      params,
      false,
      {
        handleError: (error) => {
          console.error("Error fetching statistics:", error);
        },
      }
    );
    return "data" in response ? response.data! : response;
  };

  const { data: statistics, isLoading } = useSWR<Statistics>(
    currentMainIndicator
      ? [
          currentMainIndicator,
          { from: fromDate || undefined, to: toDate || undefined },
        ]
      : null,
    (args: [string, { from?: string; to?: string }]) =>
      fetcher(args[0], args[1])
  );

  return (
    <div className="mb-6">
      <div className="flex justify-end text-right mb-4 w-full">
        <div className="w-full">
          <Popover placement="bottom">
            <PopoverTrigger>
              <Button
                color="primary"
                variant="bordered"
                className={`bg-brand-red-dark text-white px-8 ${buttonStyles}`}
              >
                View Statistics
              </Button>
            </PopoverTrigger>
            <PopoverContent className="bg-white p-2 rounded-lg shadow-lg mt-2">
              <div className="space-y-3 w-[200px]">
                <div className="space-y-2">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-600">From</label>
                    <input
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-600">To</label>
                    <input
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      color="danger"
                      variant="light"
                      onClick={clearFilters}
                      className="text-brand-red-dark"
                    >
                      Clear
                    </Button>
                  </div>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {isLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-16 w-full rounded-lg" />
                      <Skeleton className="h-16 w-full rounded-lg" />
                      <Skeleton className="h-16 w-full rounded-lg" />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {statistics?.sub_indicators.map(
                        (stat: SubIndicatorStatistic) => (
                          <div
                            key={stat.id}
                            className="bg-[#FFF5F5] p-2 rounded-lg"
                          >
                            <div className="text-2xl font-bold text-[#AC0000]">
                              {stat.event_count}
                            </div>
                            <div className="text-xs font-bold">{stat.name}</div>
                          </div>
                        )
                      )}
                      {!currentMainIndicator ? (
                        <div className="text-sm text-gray-500 text-center py-2">
                          Please select a main indicator first
                        </div>
                      ) : statistics?.sub_indicators.length === 0 ? (
                        <div className="text-sm text-gray-500 text-center py-2">
                          No statistics available for selected criteria
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
