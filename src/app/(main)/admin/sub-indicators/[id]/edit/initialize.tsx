"use client";

import { useEffect } from "react";
import useSWR from "swr";
import { useSubIndicatorsStore } from "@/store/sub-indicators";
import { subIndicatorService } from "@/services/sub-indicators/api";

interface InitializeSubIndicatorProps {
  id: string;
}

export function InitializeSubIndicator({ id }: InitializeSubIndicatorProps) {
  const { setFormLoading } = useSubIndicatorsStore();

  // Common SWR config to handle errors
  const swrConfig = {
    onError: (error: Error) => {
      // Error is already handled by clientApiCall
      console.error("SWR Error:", error);
    },
    shouldRetryOnError: false,
  };

  // Fetch sub indicator data
  const { isLoading: isSubIndicatorLoading } = useSWR(
    `subIndicator/${id}`,
    async () => {
      try {
        const response = await subIndicatorService.fetchById(id);
        const subIndicator =
          response && "data" in response ? response.data : response;

        if (!subIndicator) throw new Error("Sub Indicator not found");

        useSubIndicatorsStore.setState({
          currentSubIndicator: subIndicator,
        });

        return subIndicator;
      } finally {
        if (isSubIndicatorLoading) {
          setFormLoading(false);
        }
      }
    },
    swrConfig
  );

  // Update loading states based on SWR's initial loading state
  useEffect(() => {
    if (isSubIndicatorLoading) {
      setFormLoading(true);
    }
  }, [isSubIndicatorLoading, setFormLoading]);

  return null;
}
