"use client";

import { useEventsStore } from "@/store/events";
import { userService } from "@/services/users/api";
import { subIndicatorService } from "@/services/sub-indicators/api";
import { regionService } from "@/services/regions/api";
import { thematicAreaService } from "@/services/thematic-areas/api";
import useSWR from "swr";

export function InitializeNewEvent() {
  const { setFormLoading } = useEventsStore();

  // Common SWR config to handle errors
  const swrConfig = {
    onError: (error: Error) => {
      // Error is already handled by clientApiCall
      console.error("SWR Error:", error);
    },
    shouldRetryOnError: false,
  };

  // Fetch reference data
  const { isLoading } = useSWR(
    "newEventReferenceData",
    async () => {
      try {
        const [usersResponse, subIndicatorsResponse, regionsResponse] =
          await Promise.all([
            userService.fetchAll(),
            subIndicatorService.fetchAll(),
            regionService.fetchAll(),
            thematicAreaService.fetchAll(),
          ]);

        // Extract data from responses
        const users =
          usersResponse && "data" in usersResponse
            ? usersResponse.data.users
            : usersResponse.users;
        const subIndicators =
          subIndicatorsResponse && "data" in subIndicatorsResponse
            ? subIndicatorsResponse.data.subIndicators
            : subIndicatorsResponse.subIndicators;
        const regions =
          regionsResponse && "data" in regionsResponse
            ? regionsResponse.data.regions
            : regionsResponse.regions;

        // Set reference data in store
        useEventsStore.setState({
          reporters: users,
          subIndicators,
          regions,
        });

        return {
          users,
          subIndicators,
          regions,
        };
      } finally {
        if (isLoading) {
          setFormLoading(false);
        }
      }
    },
    swrConfig
  );

  return null;
}
