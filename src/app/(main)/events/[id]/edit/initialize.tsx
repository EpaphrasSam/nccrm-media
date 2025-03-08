"use client";

import { useEventsStore } from "@/store/events";
import { eventService } from "@/services/events/api";
import { userService } from "@/services/users/api";
import { subIndicatorService } from "@/services/sub-indicators/api";
import { regionService } from "@/services/regions/api";
import { thematicAreaService } from "@/services/thematic-areas/api";
import useSWR from "swr";

interface InitializeEventProps {
  id: string;
}

export function InitializeEvent({ id }: InitializeEventProps) {
  const { setFormLoading } = useEventsStore();

  // Common SWR config to handle errors
  const swrConfig = {
    onError: (error: Error) => {
      // Error is already handled by clientApiCall
      console.error("SWR Error:", error);
    },
    shouldRetryOnError: false,
  };

  // Fetch event data and reference data
  const { isLoading } = useSWR(
    `event/${id}`,
    async () => {
      try {
        const [
          eventResponse,
          usersResponse,
          subIndicatorsResponse,
          regionsResponse,
          thematicAreasResponse,
        ] = await Promise.all([
          eventService.fetchById(id),
          userService.fetchAll(),
          subIndicatorService.fetchAll(),
          regionService.fetchAll(),
          thematicAreaService.fetchAll(),
        ]);

        // Extract data from responses
        const event =
          eventResponse && "data" in eventResponse
            ? eventResponse.data
            : eventResponse;
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
        const thematicAreas =
          thematicAreasResponse && "data" in thematicAreasResponse
            ? thematicAreasResponse.data.thematicAreas
            : thematicAreasResponse.thematicAreas;

        // Set all data in store
        useEventsStore.setState({
          currentEvent: event,
          reporters: users,
          subIndicators,
          regions,
          thematicAreas,
          formData: {
            event: {
              reporter_id: event.reporter_id,
              report_date: event.report_date,
              details: event.details,
              event_date: event.event_date,
              region_id: event.region_id,
              location_details: event.location_details,
              sub_indicator_id: event.sub_indicator_id,
              thematic_area_id: event.thematic_area_id,
            },
            perpetrator: {
              perpetrator: event.perpetrator,
              pep_gender: event.pep_gender,
              pep_age: event.pep_age,
              pep_occupation: event.pep_occupation,
              pep_organization: event.pep_organization,
              pep_note: event.pep_note,
            },
            victim: {
              victim: event.victim,
              victim_age: event.victim_age,
              victim_gender: event.victim_gender,
              victim_occupation: event.victim_occupation,
              victim_organization: event.victim_organization,
              victim_note: event.victim_note,
            },
            outcome: {
              death_count_men: event.death_count_men,
              death_count_women_chldren: event.death_count_women_chldren,
              death_details: event.death_details,
              injury_count_men: event.injury_count_men,
              injury_count_women_chldren: event.injury_count_women_chldren,
              injury_details: event.injury_details,
              losses_count: event.losses_count,
              losses_details: event.losses_details,
            },
            context: {
              info_credibility: event.info_credibility,
              info_source: event.info_source,
              geo_scope: event.geo_scope,
              impact: event.impact,
              weapons_use: event.weapons_use,
              context_details: event.context_details,
            },
          },
        });

        return event;
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
