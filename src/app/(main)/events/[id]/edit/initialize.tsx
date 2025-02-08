"use client";

import { useCallback } from "react";
import { useEventsStore } from "@/store/events";
import { InitializeStore } from "@/components/common/misc/InitializeStore";
import { fetchEventById } from "@/services/events/api";
import { fetchSubIndicators } from "@/services/sub-indicators/api";
import { fetchRegions } from "@/services/regions/api";
import { fetchUsers } from "@/services/users/api";
import { fetchThematicAreas } from "@/services/thematic-areas/api";
import { User } from "@/services/users/types";
import { SubIndicator } from "@/services/sub-indicators/types";
import { Region } from "@/services/regions/types";
import { ThematicArea } from "@/services/thematic-areas/types";

export function InitializeEvent({ id }: { id: string }) {
  const initializeEvent = useCallback(async () => {
    useEventsStore.setState({ isLoading: true });

    try {
      const [event, subIndicators, regions, users, thematicAreas] =
        await Promise.all([
          fetchEventById(id),
          fetchSubIndicators(),
          fetchRegions(),
          fetchUsers(),
          fetchThematicAreas(),
        ]);

      if (!event) throw new Error("Event not found");

      // Add reporter, sub indicator, region, and thematic area names to event
      const reporter = users.find((user: User) => user.id === event.reporterId);
      const subIndicator = subIndicators.find(
        (indicator: SubIndicator) => indicator.id === event.subIndicatorId
      );
      const region = regions.find((r: Region) => r.id === event.regionId);
      const thematicArea = thematicAreas.find(
        (area: ThematicArea) => area.id === event.thematicAreaId
      );

      const eventWithDetails = {
        ...event,
        // Keep IDs for form data
        reporterId: event.reporterId,
        subIndicatorId: event.subIndicatorId,
        regionId: event.regionId,
        thematicAreaId: event.thematicAreaId,
        // Display names for UI
        reporter: reporter?.name || "Unknown",
        subIndicator: subIndicator?.name || "Unknown",
        region: region?.name || "Unknown",
        thematicArea: thematicArea?.name || "Unknown",
        // Form data
        eventDetails: event.eventDetails || "",
        when: event.when || "",
        where: event.where || "",
        locationDetails: event.locationDetails || "",
        what: event.subIndicatorId || "", // Using subIndicatorId for the what field
        // Add perpetrator and victim data
        perpetrator: event.perpetrator || {
          name: "",
          age: "",
          gender: "",
          occupation: "",
          organization: "",
          note: "",
        },
        victim: event.victim || {
          name: "",
          age: "",
          gender: "",
          occupation: "",
          organization: "",
          note: "",
        },
        // Add outcome and context data
        outcome: event.outcome || {
          deathsMen: 0,
          deathsWomenChildren: 0,
          deathDetails: "",
          injuriesMen: 0,
          injuriesWomenChildren: 0,
          injuriesDetails: "",
          lossesProperty: 0,
          lossesDetails: "",
        },
        context: event.context || {
          informationCredibility: "",
          informationSource: "",
          geographicScope: "",
          impact: "",
          weaponsUse: "",
          details: "",
        },
      };

      useEventsStore.setState({
        currentEvent: eventWithDetails,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to fetch event:", error);
      useEventsStore.setState({
        currentEvent: undefined,
        isLoading: false,
      });
    }
  }, [id]);

  return <InitializeStore onInitialize={initializeEvent} />;
}
