"use client";

import { useCallback } from "react";
import { useRegionsStore } from "@/store/regions";
import { InitializeStore } from "@/components/common/misc/InitializeStore";
import { fetchRegions } from "../../../../services/regions/api";

export function InitializeRegions() {
  const initializeRegions = useCallback(async () => {
    useRegionsStore.setState({ isLoading: true });

    try {
      const regions = await fetchRegions();

      useRegionsStore.setState({
        regions,
        filteredRegions: regions,
        totalRegions: regions.length,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to fetch regions:", error);
      useRegionsStore.setState({
        isLoading: false,
        regions: [],
        filteredRegions: [],
        totalRegions: 0,
      });
    }
  }, []);

  return <InitializeStore onInitialize={initializeRegions} />;
}
