"use client";

import { useCallback } from "react";
import { useMainIndicatorsStore } from "@/store/main-indicators";
import { InitializeStore } from "@/components/modules/admin/layout/InitializeStore";
import { fetchMainIndicatorById } from "@/services/main-indicators/api";

export function InitializeMainIndicator({ id }: { id: string }) {
  const initializeMainIndicator = useCallback(async () => {
    useMainIndicatorsStore.setState({ isLoading: true });

    try {
      const mainIndicator = await fetchMainIndicatorById(id);
      if (!mainIndicator) throw new Error("Main Indicator not found");

      useMainIndicatorsStore.setState({
        currentMainIndicator: mainIndicator,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to fetch main indicator:", error);
      useMainIndicatorsStore.setState({
        currentMainIndicator: undefined,
        isLoading: false,
      });
    }
  }, [id]);

  return <InitializeStore onInitialize={initializeMainIndicator} />;
}
