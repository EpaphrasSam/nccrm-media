"use client";

import { useEventsStore } from "@/store/events";
import { eventService } from "@/services/events/api";
import { userService } from "@/services/users/api";
import { subIndicatorService } from "@/services/sub-indicators/api";
import useSWR from "swr";
import { useEffect } from "react";
import { storeSync } from "@/lib/store-sync";

interface InitializeEventProps {
  id: string;
  userId: string;
}

export function InitializeEvent({ id, userId }: InitializeEventProps) {
  const { setFormLoading } = useEventsStore();

  // Common SWR config to handle errors
  const swrConfig = {
    onError: (error: Error) => {
      // Error is already handled by clientApiCall
      console.error("SWR Error:", error);
    },
    shouldRetryOnError: false,
    revalidateOnFocus: false, // Prevent revalidation on window focus
    revalidateIfStale: false, // Prevent revalidation of stale data
    revalidateOnReconnect: false, // Prevent revalidation on reconnect
  };

  // Fetch event data and reference data
  const { isLoading, mutate } = useSWR(
    `event/${id}`,
    async () => {
      try {
        const [eventResponse, usersResponse, subIndicatorsResponse] =
          await Promise.all([
            eventService.fetchById(id, userId),
            userService.fetchAll(),
            subIndicatorService.fetchAll(),
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

        // Set all data in store
        useEventsStore.setState({
          currentEvent: event,
          reporters: users,
          subIndicators,
          formData: {
            event: {
              reporter_id: event.reporter_id,
              report_date: event.report_date,
              details: event.details || "",
              event_date: event.event_date || "",
              region: event.region,
              district: event.district,
              location_details: event.location_details || "",
              sub_indicator_id: event.sub_indicator_id,
              follow_ups: Array.isArray(event.follow_ups)
                ? event.follow_ups
                : [],
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

  // Subscribe to store sync to refresh data after updates
  useEffect(() => {
    const unsubscribe = storeSync.subscribe(() => {
      mutate();
    });
    return () => {
      unsubscribe();
    };
  }, [mutate]);

  return null;
}
