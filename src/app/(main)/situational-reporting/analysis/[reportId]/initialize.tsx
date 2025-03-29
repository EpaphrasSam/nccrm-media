"use client";

import { useSituationalReportingStore } from "@/store/situational-reporting";
import { mainIndicatorService } from "@/services/main-indicators/api";
import { thematicAreaService } from "@/services/thematic-areas/api";
import useSWR from "swr";

interface InitializeAnalysisProps {
  reportId: string;
}

export function InitializeAnalysis({ reportId }: InitializeAnalysisProps) {
  const { setFormLoading, setAnalysisLoading } = useSituationalReportingStore();

  // Common SWR config to handle errors and prevent unnecessary revalidation
  const swrConfig = {
    onError: (error: Error) => {
      console.error("SWR Error:", error);
    },
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false,
  };

  // Fetch all required data
  useSWR(
    `analysis-init/${reportId}`,
    async () => {
      try {
        setFormLoading(true);
        setAnalysisLoading(true);

        // Fetch all required data in parallel
        const [thematicAreasResponse, mainIndicatorsResponse] =
          await Promise.all([
            thematicAreaService.fetchAll(),
            mainIndicatorService.fetchAll(),
          ]);

        // Extract data from responses
        const thematicAreas =
          "data" in thematicAreasResponse
            ? thematicAreasResponse.data.thematicAreas
            : thematicAreasResponse.thematicAreas;

        const mainIndicators =
          "data" in mainIndicatorsResponse
            ? mainIndicatorsResponse.data.mainIndicators
            : mainIndicatorsResponse.mainIndicators;

        // Update store with fetched data
        useSituationalReportingStore.setState({
          thematicAreas,
          mainIndicators,
          currentThematicArea: thematicAreas[0]?.id, // Select first thematic area by default
        });

        return { thematicAreas, mainIndicators };
      } finally {
        setFormLoading(false);
        setAnalysisLoading(false);
      }
    },
    swrConfig
  );

  return null;
}
