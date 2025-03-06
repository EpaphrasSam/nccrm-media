"use client";

import { useEffect } from "react";
import useSWR from "swr";
import { useSubIndicatorsStore } from "@/store/sub-indicators";
import { subIndicatorService } from "@/services/sub-indicators/api";
import type { SubIndicatorQueryParams } from "@/services/sub-indicators/types";
import { urlSync } from "@/utils/url-sync";

interface InitializeSubIndicatorsProps {
  initialFilters: Partial<SubIndicatorQueryParams>;
}

const DEFAULT_FILTERS: SubIndicatorQueryParams = {
  page: 1,
  limit: 10,
};

export function InitializeSubIndicators({
  initialFilters,
}: InitializeSubIndicatorsProps) {
  const { filters, setFilters, setTableLoading } = useSubIndicatorsStore();

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

  // Fetch sub indicators data - will refetch when filters change
  const { isLoading: isSubIndicatorsLoading } = useSWR(
    ["subIndicators", filters],
    async () => {
      try {
        const response = await subIndicatorService.fetchAll(filters);
        const data = "data" in response ? response.data : response;

        useSubIndicatorsStore.setState({
          subIndicators: data.subIndicators,
          totalSubIndicators: data.totalSubIndicators,
          totalPages: data.totalPages,
        });

        return data;
      } finally {
        // Only update loading state after initial load
        if (isSubIndicatorsLoading) {
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
    if (isSubIndicatorsLoading) {
      setTableLoading(true);
    }
  }, [isSubIndicatorsLoading, setTableLoading]);

  return null;
}
