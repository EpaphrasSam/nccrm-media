"use client";

import { useCallback } from "react";
import { useThematicAreasStore } from "@/store/thematic-areas";
import { InitializeStore } from "@/components/modules/admin/layout/InitializeStore";
import { fetchThematicAreas } from "./api";

export function InitializeThematicAreas() {
  const initializeThematicAreas = useCallback(async () => {
    useThematicAreasStore.setState({ isLoading: true });

    try {
      const thematicAreas = await fetchThematicAreas();

      useThematicAreasStore.setState({
        thematicAreas,
        filteredThematicAreas: thematicAreas,
        totalThematicAreas: thematicAreas.length,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to fetch thematic areas:", error);
      useThematicAreasStore.setState({
        isLoading: false,
        thematicAreas: [],
        filteredThematicAreas: [],
        totalThematicAreas: 0,
      });
    }
  }, []);

  return <InitializeStore onInitialize={initializeThematicAreas} />;
}
