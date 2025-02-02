"use client";

import { useCallback } from "react";
import { useSubIndicatorsStore } from "@/store/sub-indicators";
import { InitializeStore } from "@/components/modules/admin/layout/InitializeStore";
import { fetchSubIndicators } from "./api";

export function InitializeSubIndicators() {
  const initializeSubIndicators = useCallback(async () => {
    useSubIndicatorsStore.setState({ isLoading: true });

    try {
      const subIndicators = await fetchSubIndicators();

      useSubIndicatorsStore.setState({
        subIndicators,
        filteredSubIndicators: subIndicators,
        totalSubIndicators: subIndicators.length,
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
