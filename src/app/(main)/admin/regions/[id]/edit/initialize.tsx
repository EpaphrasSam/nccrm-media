"use client";

import { useCallback } from "react";
import { useRegionsStore } from "@/store/regions";
import { InitializeStore } from "@/components/modules/admin/layout/InitializeStore";
import { fetchRegionById } from "@/services/regions/api";

export function InitializeRegion({ id }: { id: string }) {
  const initializeRegion = useCallback(async () => {
    useRegionsStore.setState({ isLoading: true });

    try {
      const region = await fetchRegionById(id);
      if (!region) throw new Error("Region not found");

      useRegionsStore.setState({
        currentRegion: region,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to fetch region:", error);
      useRegionsStore.setState({
        currentRegion: undefined,
        isLoading: false,
      });
    }
  }, [id]);

  return <InitializeStore onInitialize={initializeRegion} />;
}
