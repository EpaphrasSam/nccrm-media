"use client";

import { useCallback } from "react";
import { useSubIndicatorsStore } from "@/store/sub-indicators";
import { InitializeStore } from "@/components/common/misc/InitializeStore";
import { fetchSubIndicatorById } from "@/services/sub-indicators/api";
import { fetchMainIndicators } from "@/services/main-indicators/api";

export function InitializeSubIndicator({ id }: { id: string }) {
  const initializeSubIndicator = useCallback(async () => {
    useSubIndicatorsStore.setState({ isLoading: true });

    try {
      const [subIndicator, mainIndicators] = await Promise.all([
        fetchSubIndicatorById(id),
        fetchMainIndicators(),
      ]);

      if (!subIndicator) throw new Error("Sub Indicator not found");

      // Add main indicator name to sub indicator
      const mainIndicator = mainIndicators.find(
        (main) => main.id === subIndicator.mainIndicatorId
      );
      const subIndicatorWithMainIndicator = {
        ...subIndicator,
        mainIndicator: mainIndicator?.name || "Unknown",
      };

      useSubIndicatorsStore.setState({
        currentSubIndicator: subIndicatorWithMainIndicator,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to fetch sub indicator:", error);
      useSubIndicatorsStore.setState({
        currentSubIndicator: undefined,
        isLoading: false,
      });
    }
  }, [id]);

  return <InitializeStore onInitialize={initializeSubIndicator} />;
}
