"use client";

import { useCallback } from "react";
import { useThematicAreasStore } from "@/store/thematic-areas";
import { InitializeStore } from "@/components/modules/admin/layout/InitializeStore";
import { fetchThematicAreaById } from "@/services/thematic-areas/api";

export function InitializeThematicArea({ id }: { id: string }) {
  const initializeThematicArea = useCallback(async () => {
    useThematicAreasStore.setState({ isLoading: true });

    try {
      const thematicArea = await fetchThematicAreaById(id);
      if (!thematicArea) throw new Error("Thematic Area not found");

      useThematicAreasStore.setState({
        currentThematicArea: thematicArea,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to fetch thematic area:", error);
      useThematicAreasStore.setState({
        currentThematicArea: undefined,
        isLoading: false,
      });
    }
  }, [id]);

  return <InitializeStore onInitialize={initializeThematicArea} />;
}
