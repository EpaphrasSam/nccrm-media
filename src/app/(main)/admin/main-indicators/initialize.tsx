"use client";

import { useCallback } from "react";
import { useMainIndicatorsStore } from "@/store/main-indicators";
import { InitializeStore } from "@/components/modules/admin/layout/InitializeStore";
import { fetchMainIndicators } from "../../../../services/main-indicators/api";

export function InitializeMainIndicators() {
  const initializeMainIndicators = useCallback(async () => {
    useMainIndicatorsStore.setState({ isLoading: true });

    try {
      const mainIndicators = await fetchMainIndicators();

      useMainIndicatorsStore.setState({
        mainIndicators,
        filteredMainIndicators: mainIndicators,
        totalMainIndicators: mainIndicators.length,
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
