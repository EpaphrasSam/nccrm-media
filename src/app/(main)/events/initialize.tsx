"use client";

import { useEffect } from "react";
import useSWR from "swr";
import { useEventsStore } from "@/store/events";
import { eventService } from "@/services/events/api";
import type { EventQueryParams } from "@/services/events/types";
import { urlSync } from "@/utils/url-sync";
import { storeSync } from "@/lib/store-sync";
import { thematicAreaService } from "@/services/thematic-areas/api";

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

  // Fetch filter options (sub indicators only)
  const { isLoading: isFilterOptionsLoading, mutate: mutateFilters } = useSWR(
    "filterOptions",
    async () => {
      try {
        const thematicAreasResponse = await thematicAreaService.fetchAll(
          undefined
        );

        return {
          thematicAreas:
            "data" in thematicAreasResponse
              ? thematicAreasResponse.data.thematicAreas
              : thematicAreasResponse.thematicAreas,
        };
      } finally {
        if (isFilterOptionsLoading) {
          setFiltersLoading(false);
        }
      }
    },
    swrConfig
  );

  // Fetch events data - will refetch when filters change
  const { isLoading: isEventsLoading, mutate: mutateEvents } = useSWR(
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

  // Subscribe to store sync
  useEffect(() => {
    const unsubscribe = storeSync.subscribe(() => {
      mutateEvents();
      mutateFilters();
    });
    return () => {
      unsubscribe();
    };
  }, [mutateEvents, mutateFilters]);

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
