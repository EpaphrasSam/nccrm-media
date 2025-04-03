"use client";

import { useEffect } from "react";
import useSWR from "swr";
import { useThematicAreasStore } from "@/store/thematic-areas";
import { thematicAreaService } from "@/services/thematic-areas/api";
import type { ThematicAreaQueryParams } from "@/services/thematic-areas/types";
import { urlSync } from "@/utils/url-sync";
import { storeSync } from "@/lib/store-sync";

interface InitializeThematicAreasProps {
  initialFilters: Partial<ThematicAreaQueryParams>;
}

const DEFAULT_FILTERS: ThematicAreaQueryParams = {
  page: 1,
  limit: 10,
};

export function InitializeThematicAreas({
  initialFilters,
}: InitializeThematicAreasProps) {
  const { filters, setFilters, setTableLoading } = useThematicAreasStore();

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

  // Fetch thematic areas data - will refetch when filters change
  const { isLoading: isThematicAreasLoading, mutate } = useSWR(
    ["thematicAreas", filters],
    async () => {
      try {
        const response = await thematicAreaService.fetchAll(filters);
        const data = "data" in response ? response.data : response;

        useThematicAreasStore.setState({
          thematicAreas: data.thematicAreas,
          totalThematicAreas: data.totalThematicAreas,
          totalPages: data.totalPages,
        });

        return data;
      } finally {
        if (isThematicAreasLoading) {
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
    if (isThematicAreasLoading) {
      setTableLoading(true);
    }
  }, [isThematicAreasLoading, setTableLoading]);

  return null;
}
