"use client";

import { useEffect } from "react";
import useSWR from "swr";
import { situationalReportingService } from "@/services/situational-reporting/api";
import { useSituationalReportingStore } from "@/store/situational-reporting";
import type {
  OverviewSummaryFilters,
  SituationalAnalysis,
} from "@/services/situational-reporting/types";

interface InitializeOverviewSummaryProps {
  initialFilters: Partial<OverviewSummaryFilters>;
}

export function InitializeOverviewSummary({
  initialFilters,
}: InitializeOverviewSummaryProps) {
  const {
    overviewFilters,
    setOverviewFilters,
    setOverviewTableLoading,
    setOverviewData,
  } = useSituationalReportingStore();

  // Set initial filters only if both from and to are provided
  useEffect(() => {
    if (initialFilters?.from && initialFilters?.to) {
      setOverviewFilters(initialFilters);
    }
  }, [initialFilters, setOverviewFilters]);

  // Always fetch data, with or without filters
  const { isLoading } = useSWR(
    ["overview-summary", overviewFilters],
    async () => {
      const response = await situationalReportingService.getAnalysis(
        overviewFilters || {},
        false,
        {
          handleError: (error: string) => {
            console.error("Error fetching overview summary:", error);
          },
        }
      );
      // Convert object with numeric keys into a proper array
      return Object.values(response);
    },
    {
      onSuccess: (data: SituationalAnalysis[]) => {
        setOverviewData(data);
      },
    }
  );

  // Update loading state
  useEffect(() => {
    setOverviewTableLoading(isLoading);
  }, [isLoading, setOverviewTableLoading]);

  return null;
}
