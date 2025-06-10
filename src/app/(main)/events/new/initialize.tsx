"use client";

import { useEventsStore } from "@/store/events";
import { subIndicatorService } from "@/services/sub-indicators/api";
import useSWR from "swr";
import { useEffect } from "react";

export function InitializeNewEvent() {
  const { setFormLoading, setMode } = useEventsStore();

  // Set new mode when component mounts, but don't reset step/data
  useEffect(() => {
    setMode("new");
    // Don't reset step - let it restore from localStorage if available
  }, [setMode]);

  // Common SWR config to handle errors
  const swrConfig = {
    onError: (error: Error) => {
      // Error is already handled by clientApiCall
      console.error("SWR Error:", error);
    },
    shouldRetryOnError: false,
  };

  // Fetch reference data
  const { isLoading } = useSWR(
    "newEventReferenceData",
    async () => {
      try {
        const subIndicatorsResponse = await subIndicatorService.fetchAll();

        const subIndicators =
          subIndicatorsResponse && "data" in subIndicatorsResponse
            ? subIndicatorsResponse.data.subIndicators
            : subIndicatorsResponse.subIndicators;

        // Set reference data in store
        useEventsStore.setState({
          subIndicators,
        });

        return {
          subIndicators,
        };
      } finally {
        if (isLoading) {
          setFormLoading(false);
        }
      }
    },
    swrConfig
  );

  return null;
}
