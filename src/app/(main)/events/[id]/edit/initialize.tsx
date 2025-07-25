"use client";

import { useEventsStore } from "@/store/events";
import { eventService } from "@/services/events/api";
import { subIndicatorService } from "@/services/sub-indicators/api";
import useSWR, { SWRConfiguration, mutate as swrMutate } from "swr";
import { useEffect } from "react";
import { storeSync } from "@/lib/store-sync";
import { addToast } from "@heroui/toast";
import { navigationService } from "@/utils/navigation";

interface InitializeEventProps {
  id: string;
  userId: string;
}

export function InitializeEvent({ id, userId }: InitializeEventProps) {
  const { setFormLoading, setMode, setCurrentStep } = useEventsStore();

  // Set edit mode and reset step when component mounts
  useEffect(() => {
    setMode("edit");
    setCurrentStep("event");
  }, [id, setMode, setCurrentStep]);

  // Common SWR config to handle errors
  const swrConfig: SWRConfiguration = {
    onError: (error: Error) => {
      // Error is already handled by clientApiCall
      console.error("SWR Error:", error);
    },
    revalidateOnMount: true,
    revalidateOnFocus: true,
    revalidateIfStale: true,
    keepPreviousData: false,
  };

  // Fetch event data and reference data
  const { isLoading, mutate, isValidating } = useSWR(
    `event/${id}`,
    async () => {
      try {
        const [eventResponse, subIndicatorsResponse] = await Promise.all([
          eventService.fetchById(id, userId),
          subIndicatorService.fetchAll(),
        ]);

        // Extract data from responses
        const event =
          eventResponse && "data" in eventResponse
            ? eventResponse.data
            : eventResponse;
        const subIndicators =
          subIndicatorsResponse && "data" in subIndicatorsResponse
            ? subIndicatorsResponse.data.subIndicators
            : subIndicatorsResponse.subIndicators;

        if (!event && !isLoading) {
          addToast({
            title: "Error",
            description: "Event not found",
            color: "danger",
          });
          navigationService.navigate("/events");
          return;
        }

        // Set data in store for edit mode
        // We need to populate formData for "Save Anywhere" to work, but preserve any existing formData
        const currentState = useEventsStore.getState();

        useEventsStore.setState({
          currentEvent: event,
          subIndicators,
          // Only populate formData if it's not already populated (e.g., direct URL access)
          // If editEvent() was called, formData should already be set
          formData: currentState.formData.event
            ? currentState.formData
            : {
                event: {
                  reporter_id: event?.reporter?.id || "",
                  report_date: event?.report_date || "",
                  details: event?.details || "",
                  event_date: event?.event_date || "",
                  region: event?.region || "",
                  district: event?.district || "",
                  city: event?.city || "",
                  coordinates: event?.coordinates || "",
                  location_details: event?.location_details || "",
                  sub_indicator_id: event?.sub_indicator_id || "",
                  follow_ups: Array.isArray(event?.follow_ups)
                    ? event?.follow_ups
                    : [],
                },
                perpetrator: {
                  perpetrator: event?.perpetrator || "",
                  pep_gender: event?.pep_gender || "",
                  pep_age: event?.pep_age || "",
                  pep_occupation: event?.pep_occupation || "",
                  pep_note: event?.pep_note || "",
                },
                victim: {
                  victim: event?.victim || "",
                  victim_age: event?.victim_age || "",
                  victim_gender: event?.victim_gender || "",
                  victim_occupation: event?.victim_occupation || "",
                  victim_note: event?.victim_note || "",
                },
                outcome: {
                  death_count_men: event?.death_count_men || 0,
                  death_count_women_chldren:
                    event?.death_count_women_chldren || 0,
                  death_details: event?.death_details || "",
                  injury_count_men: event?.injury_count_men || 0,
                  injury_count_women_chldren:
                    event?.injury_count_women_chldren || 0,
                  injury_details: event?.injury_details || "",
                  losses_count: event?.losses_count || 0,
                  losses_details: event?.losses_details || "",
                },
                context: {
                  info_source: event?.info_source || "",
                  impact: event?.impact || "",
                  weapons_use: event?.weapons_use || "",
                  context_details: event?.context_details || "",
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

  useEffect(() => {
    return () => {
      swrMutate(`event/${id}`, undefined, { revalidate: false });
    };
  }, [id]);

  useEffect(() => {
    setFormLoading(isLoading || isValidating);
  }, [isLoading, isValidating, setFormLoading]);

  return null;
}
