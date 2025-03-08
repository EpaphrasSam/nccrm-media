"use client";

import { useEffect } from "react";
import useSWR from "swr";
import { useMainIndicatorsStore } from "@/store/main-indicators";
import { mainIndicatorService } from "@/services/main-indicators/api";

interface InitializeMainIndicatorProps {
  id: string;
}

export function InitializeMainIndicator({ id }: InitializeMainIndicatorProps) {
  const { setFormLoading } = useMainIndicatorsStore();

  // Common SWR config to handle errors
  const swrConfig = {
    onError: (error: Error) => {
      // Error is already handled by clientApiCall
      console.error("SWR Error:", error);
    },
    shouldRetryOnError: false,
  };

  // Fetch main indicator data
  const { isLoading: isMainIndicatorLoading } = useSWR(
    `mainIndicator/${id}`,
    async () => {
      try {
        const response = await mainIndicatorService.fetchById(id);
        const mainIndicator =
          response && "data" in response ? response.data : response;
        useMainIndicatorsStore.setState({
          currentMainIndicator: mainIndicator || undefined,
        });
        return mainIndicator;
      } finally {
        if (isMainIndicatorLoading) {
          setFormLoading(false);
        }
      }
    },
    swrConfig
  );

  // Update loading states based on SWR's initial loading state
  useEffect(() => {
    if (isMainIndicatorLoading) {
      setFormLoading(true);
    }
  }, [isMainIndicatorLoading, setFormLoading]);

  return null;
}
