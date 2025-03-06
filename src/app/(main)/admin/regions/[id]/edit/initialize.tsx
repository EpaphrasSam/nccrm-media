"use client";

import { useEffect } from "react";
import useSWR from "swr";
import { useRegionsStore } from "@/store/regions";
import { regionService } from "@/services/regions/api";

interface InitializeRegionProps {
  id: string;
}

export function InitializeRegion({ id }: InitializeRegionProps) {
  const { setFormLoading } = useRegionsStore();

  // Common SWR config to handle errors
  const swrConfig = {
    onError: (error: Error) => {
      // Error is already handled by clientApiCall
      console.error("SWR Error:", error);
    },
    shouldRetryOnError: false,
  };

  // Fetch region data
  const { isLoading: isRegionLoading } = useSWR(
    `region/${id}`,
    async () => {
      try {
        const response = await regionService.fetchById(id);
        const region =
          response && "data" in response ? response.data : response;
        useRegionsStore.setState({
          currentRegion: region?.region || undefined,
        });
        return region;
      } finally {
        if (isRegionLoading) {
          setFormLoading(false);
        }
      }
    },
    swrConfig
  );

  // Update loading states based on SWR's initial loading state
  useEffect(() => {
    if (isRegionLoading) {
      setFormLoading(true);
    }
  }, [isRegionLoading, setFormLoading]);

  return null;
}
