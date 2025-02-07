"use client";

import { useCallback } from "react";
import { useSubIndicatorsStore } from "@/store/sub-indicators";
import { InitializeStore } from "@/components/modules/admin/layout/InitializeStore";
import { fetchSubIndicators } from "@/services/sub-indicators/api";
import { fetchMainIndicators } from "@/services/main-indicators/api";
import { SubIndicatorWithMainIndicator } from "@/services/sub-indicators/types";

export function InitializeSubIndicators() {
  const initializeSubIndicators = useCallback(async () => {
    useSubIndicatorsStore.setState({ isLoading: true });

    try {
      const [subIndicators, mainIndicators] = await Promise.all([
        fetchSubIndicators(),
        fetchMainIndicators(),
      ]);

      // Add main indicator names to sub indicators
      const subIndicatorsWithMainIndicators: SubIndicatorWithMainIndicator[] =
        subIndicators.map((indicator) => {
          const mainIndicator = mainIndicators.find(
            (main) => main.id === indicator.mainIndicatorId
          );
          return {
            ...indicator,
            mainIndicator: mainIndicator?.name || "Unknown",
          };
        });

      useSubIndicatorsStore.setState({
        subIndicators: subIndicatorsWithMainIndicators,
        filteredSubIndicators: subIndicatorsWithMainIndicators,
        totalSubIndicators: subIndicatorsWithMainIndicators.length,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to fetch sub indicators:", error);
      useSubIndicatorsStore.setState({
        isLoading: false,
        subIndicators: [],
        filteredSubIndicators: [],
        totalSubIndicators: 0,
      });
    }
  }, []);

  return <InitializeStore onInitialize={initializeSubIndicators} />;
}
