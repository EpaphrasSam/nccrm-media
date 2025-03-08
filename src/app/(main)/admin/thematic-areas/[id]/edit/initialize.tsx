"use client";

import { useEffect } from "react";
import useSWR from "swr";
import { useThematicAreasStore } from "@/store/thematic-areas";
import { thematicAreaService } from "@/services/thematic-areas/api";

interface InitializeThematicAreaProps {
  id: string;
}

export function InitializeThematicArea({ id }: InitializeThematicAreaProps) {
  const { setFormLoading } = useThematicAreasStore();

  // Common SWR config to handle errors
  const swrConfig = {
    onError: (error: Error) => {
      // Error is already handled by clientApiCall
      console.error("SWR Error:", error);
    },
    shouldRetryOnError: false,
  };

  // Fetch thematic area data
  const { isLoading: isThematicAreaLoading } = useSWR(
    `thematicArea/${id}`,
    async () => {
      try {
        const response = await thematicAreaService.fetchById(id);
        const thematicArea =
          response && "data" in response ? response.data : response;
        useThematicAreasStore.setState({
          currentThematicArea: thematicArea || undefined,
        });
        return thematicArea;
      } finally {
        if (isThematicAreaLoading) {
          setFormLoading(false);
        }
      }
    },
    swrConfig
  );

  // Update loading states based on SWR's initial loading state
  useEffect(() => {
    if (isThematicAreaLoading) {
      setFormLoading(true);
    }
  }, [isThematicAreaLoading, setFormLoading]);

  return null;
}
