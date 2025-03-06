"use client";

import { useEffect } from "react";
import useSWR from "swr";
import { useRegionsStore } from "@/store/regions";
import { regionService } from "@/services/regions/api";
import type { RegionQueryParams } from "@/services/regions/types";
import { urlSync } from "@/utils/url-sync";

interface InitializeRegionsProps {
  initialFilters: Partial<RegionQueryParams>;
}

const DEFAULT_FILTERS: RegionQueryParams = {
  page: 1,
  limit: 10,
};

export function InitializeRegions({ initialFilters }: InitializeRegionsProps) {
  const { filters, setFilters, setTableLoading } = useRegionsStore();

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

  // Fetch regions data - will refetch when filters change
  const { isLoading: isRegionsLoading } = useSWR(
    ["regions", filters],
    async () => {
      try {
        const response = await regionService.fetchAll(filters);
        const data = "data" in response ? response.data : response;

        useRegionsStore.setState({
          regions: data.regions,
          totalRegions: data.totalRegions,
          totalPages: data.totalPages,
        });

        return data;
      } finally {
        // Only update loading state after initial load
        if (isRegionsLoading) {
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
    if (isRegionsLoading) {
      setTableLoading(true);
    }
  }, [isRegionsLoading, setTableLoading]);

  return null;
}
