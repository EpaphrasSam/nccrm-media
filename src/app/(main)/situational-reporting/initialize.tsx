"use client";

import { useEffect } from "react";
import useSWR from "swr";
import { useSituationalReportingStore } from "@/store/situational-reporting";
import { situationalReportingService } from "@/services/situational-reporting/api";
import type { SituationalReportQueryParams } from "@/services/situational-reporting/types";
import { urlSync } from "@/utils/url-sync";

interface InitializeSituationalReportingProps {
  initialFilters: Partial<SituationalReportQueryParams>;
}

const DEFAULT_FILTERS: SituationalReportQueryParams = {
  page: 1,
  limit: 10,
  // year: new Date().getFullYear(),
};

export function InitializeSituationalReporting({
  initialFilters,
}: InitializeSituationalReportingProps) {
  const { filters, setFilters, setTableLoading } =
    useSituationalReportingStore();

  // Set initial filters from URL or defaults
  useEffect(() => {
    const hasInitialFilters = Object.keys(initialFilters).length > 0;
    if (hasInitialFilters) {
      setFilters(initialFilters);
    } else {
      // If no URL params exist, set defaults and push to URL
      setFilters(DEFAULT_FILTERS);
      urlSync.pushToUrl(DEFAULT_FILTERS);
    }
  }, [initialFilters, setFilters]);

  // Common SWR config to handle errors
  const swrConfig = {
    onError: (error: Error) => {
      // Error is already handled by clientApiCall
      console.error("SWR Error:", error);
    },
    shouldRetryOnError: false, // Disable automatic retries
  };

  // Fetch reports data - will refetch when filters change
  const { isLoading: isReportsLoading } = useSWR(
    ["reports", filters],
    async () => {
      try {
        const response = await situationalReportingService.getReports(filters);
        const data = "data" in response ? response.data : response;

        useSituationalReportingStore.setState({
          reports: data.situationalReports,
          totalReports: data.totalReports,
          totalPages: data.totalPages,
        });

        return data;
      } finally {
        // Only update loading state after initial load
        if (isReportsLoading) {
          setTableLoading(false);
        }
      }
    },
    {
      ...swrConfig,
      keepPreviousData: true,
    }
  );

  // Update loading states based on SWR's initial loading state
  useEffect(() => {
    if (isReportsLoading) {
      setTableLoading(true);
    }
  }, [isReportsLoading, setTableLoading]);

  return null;
}
