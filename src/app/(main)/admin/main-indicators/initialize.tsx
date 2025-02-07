"use client";

import { useCallback } from "react";
import { useMainIndicatorsStore } from "@/store/main-indicators";
import { InitializeStore } from "@/components/modules/admin/layout/InitializeStore";
import { fetchMainIndicators } from "@/services/main-indicators/api";
import { fetchThematicAreas } from "@/services/thematic-areas/api";
import { MainIndicatorWithThematicArea } from "@/services/main-indicators/types";

export function InitializeMainIndicators() {
  const initializeMainIndicators = useCallback(async () => {
    useMainIndicatorsStore.setState({ isLoading: true });

    try {
      const [mainIndicators, thematicAreas] = await Promise.all([
        fetchMainIndicators(),
        fetchThematicAreas(),
      ]);

      // Add thematic area names to main indicators
      const mainIndicatorsWithThematicAreas: MainIndicatorWithThematicArea[] =
        mainIndicators.map((indicator) => {
          const thematicArea = thematicAreas.find(
            (area) => area.id === indicator.thematicAreaId
          );
          return {
            ...indicator,
            thematicArea: thematicArea?.name || "Unknown",
          };
        });

      useMainIndicatorsStore.setState({
        mainIndicators: mainIndicatorsWithThematicAreas,
        filteredMainIndicators: mainIndicatorsWithThematicAreas,
        totalMainIndicators: mainIndicatorsWithThematicAreas.length,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to fetch main indicators:", error);
      useMainIndicatorsStore.setState({
        isLoading: false,
        mainIndicators: [],
        filteredMainIndicators: [],
        totalMainIndicators: 0,
      });
    }
  }, []);

  return <InitializeStore onInitialize={initializeMainIndicators} />;
}
