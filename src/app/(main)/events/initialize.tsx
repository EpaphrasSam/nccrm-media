"use client";

import { useCallback } from "react";
import { useEventsStore } from "@/store/events";
import { InitializeStore } from "@/components/common/misc/InitializeStore";
import { fetchEvents } from "@/services/events/api";
import { fetchSubIndicators } from "@/services/sub-indicators/api";
import { fetchRegions } from "@/services/regions/api";
import { fetchUsers } from "@/services/users/api";
import { fetchThematicAreas } from "@/services/thematic-areas/api";
import { EventWithDetails } from "@/services/events/types";

export function InitializeEvents() {
  const initializeEvents = useCallback(async () => {
    useEventsStore.setState({ isLoading: true });

    try {
      const [events, subIndicators, regions, users, thematicAreas] =
        await Promise.all([
          fetchEvents(),
          fetchSubIndicators(),
          fetchRegions(),
          fetchUsers(),
          fetchThematicAreas(),
        ]);

      // Add reporter names, sub indicator names, and region names to events
      const eventsWithDetails: EventWithDetails[] = events.map((event) => {
        const reporter = users.find((user) => user.id === event.reporterId);
        const subIndicator = subIndicators.find(
          (indicator) => indicator.id === event.subIndicatorId
        );
        const region = regions.find((r) => r.id === event.regionId);
        const thematicArea = thematicAreas.find(
          (area) => area.id === event.thematicAreaId
        );

        return {
          ...event,
          // Keep IDs for form data
          reporterId: event.reporterId,
          subIndicatorId: event.subIndicatorId,
          regionId: event.regionId,
          thematicAreaId: event.thematicAreaId || "",
          // Display names for UI
          reporter: reporter?.name || "Unknown",
          subIndicator: subIndicator?.name || "Unknown",
          region: region?.name || "Unknown",
          thematicArea: thematicArea?.name || "Unknown",
          // Initialize other required fields with defaults
          eventDetails: "",
          when: event.date || "",
          where: region?.name || "",
          locationDetails: "",
          what: event.subIndicatorId || "",
          perpetrator: {
            name: "",
            age: "",
            gender: "",
            occupation: "",
            organization: "",
            note: "",
          },
          victim: {
            name: "",
            age: "",
            gender: "",
            occupation: "",
            organization: "",
            note: "",
          },
          outcome: {
            deathsMen: 0,
            deathsWomenChildren: 0,
            deathDetails: "",
            injuriesMen: 0,
            injuriesWomenChildren: 0,
            injuriesDetails: "",
            lossesProperty: 0,
            lossesDetails: "",
          },
          context: {
            informationCredibility: "",
            informationSource: "",
            geographicScope: "",
            impact: "",
            weaponsUse: "",
            details: "",
          },
        };
      });

      useEventsStore.setState({
        events: eventsWithDetails,
        filteredEvents: eventsWithDetails,
        totalEvents: eventsWithDetails.length,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to fetch events:", error);
      useEventsStore.setState({
        isLoading: false,
        events: [],
        filteredEvents: [],
        totalEvents: 0,
      });
    }
  }, []);

  return <InitializeStore onInitialize={initializeEvents} />;
}
