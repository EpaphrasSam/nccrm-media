"use client";

import { useEffect } from "react";
import useSWR from "swr";
import { useMainIndicatorsStore } from "@/store/main-indicators";
import { mainIndicatorService } from "@/services/main-indicators/api";
import type { MainIndicatorQueryParams } from "@/services/main-indicators/types";
import { urlSync } from "@/utils/url-sync";
import { storeSync } from "@/lib/store-sync";

interface InitializeMainIndicatorsProps {
  initialFilters: Partial<MainIndicatorQueryParams>;
}

const DEFAULT_FILTERS: MainIndicatorQueryParams = {
  page: 1,
  limit: 10,
};

export function InitializeMainIndicators({
  initialFilters,
}: InitializeMainIndicatorsProps) {
  const { filters, setFilters, setTableLoading } = useMainIndicatorsStore();

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

  // Fetch main indicators data - will refetch when filters change
  const { isLoading: isMainIndicatorsLoading, mutate } = useSWR(
    ["mainIndicators", filters],
    async () => {
      try {
        const response = await mainIndicatorService.fetchAll(filters);
        const data = "data" in response ? response.data : response;

        useMainIndicatorsStore.setState({
          mainIndicators: data.mainIndicators,
          totalMainIndicators: data.totalMainIndicators,
          totalPages: data.totalPages,
        });

        return data;
      } finally {
        if (isMainIndicatorsLoading) {
          setTableLoading(false);
        }
      }
    },
    {
      ...swrConfig,
      keepPreviousData: true,
    }
  );

  // Subscribe to store sync
  useEffect(() => {
    const unsubscribe = storeSync.subscribe(() => {
      mutate();
    });

    return () => {
      unsubscribe();
    };
  }, [mutate]);

  // Update loading state based on SWR's initial loading state
  useEffect(() => {
    if (isMainIndicatorsLoading) {
      setTableLoading(true);
    }
  }, [isMainIndicatorsLoading, setTableLoading]);

  return null;
}
