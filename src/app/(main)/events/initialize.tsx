"use client";

import { useEffect } from "react";
import useSWR from "swr";
import { useEventsStore } from "@/store/events";
import { eventService } from "@/services/events/api";
import { subIndicatorService } from "@/services/sub-indicators/api";
import { regionService } from "@/services/regions/api";
import type { EventQueryParams } from "@/services/events/types";
import { urlSync } from "@/utils/url-sync";

interface InitializeEventsProps {
  initialFilters: Partial<EventQueryParams>;
}

const DEFAULT_FILTERS: EventQueryParams = {
  page: 1,
  limit: 10,
};

export function InitializeEvents({ initialFilters }: InitializeEventsProps) {
  const { filters, setFilters, setTableLoading, setFiltersLoading } =
    useEventsStore();

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

  // Fetch filter options (sub indicators and regions)
  const { isLoading: isFilterOptionsLoading } = useSWR(
    "filterOptions",
    async () => {
      try {
        const [subIndicatorsResponse, regionsResponse] = await Promise.all([
          subIndicatorService.fetchAll(undefined),
          regionService.fetchAll(undefined),
        ]);

        return {
          subIndicators:
            "data" in subIndicatorsResponse
              ? subIndicatorsResponse.data.subIndicators
              : subIndicatorsResponse.subIndicators,
          regions:
            "data" in regionsResponse
              ? regionsResponse.data.regions
              : regionsResponse.regions,
        };
      } finally {
        // Only update loading state after initial load
        if (isFilterOptionsLoading) {
          setFiltersLoading(false);
        }
      }
    },
    swrConfig
  );

  // Fetch events data - will refetch when filters change
  const { isLoading: isEventsLoading } = useSWR(
    ["events", filters],
    async () => {
      try {
        const response = await eventService.fetchAll(filters);
        const data = "data" in response ? response.data : response;

        useEventsStore.setState({
          events: data.events,
          totalEvents: data.totalEvents,
          totalPages: data.totalPages,
        });

        return data;
      } finally {
        // Only update loading state after initial load
        if (isEventsLoading) {
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
    if (isFilterOptionsLoading) {
      setFiltersLoading(true);
    }
  }, [isFilterOptionsLoading, setFiltersLoading]);

  useEffect(() => {
    if (isEventsLoading) {
      setTableLoading(true);
    }
  }, [isEventsLoading, setTableLoading]);

  return null;
}
