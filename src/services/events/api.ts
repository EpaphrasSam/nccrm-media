import { fetchClient } from "@/utils/fetch-client";
import { clientApiCall, serverApiCall } from "@/utils/api-wrapper";
import type {
  Event,
  EventListResponse,
  EventDetailResponse,
  EventCreateInput,
  EventQueryParams,
} from "./types";

export const eventService = {
  fetchAll(params: Partial<EventQueryParams> = {}, isServer = false) {
    const promise = fetchClient
      .get<EventListResponse>("/get-events", {
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          ...(params.region && { region: params.region }),
          ...(params.status && { status: params.status }),
          ...(params.thematic_area && { thematic_area: params.thematic_area }),
          ...(params.search && { search: params.search }),
        },
      })
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, {
          message: "",
          events: [],
          totalEvents: 0,
          totalPages: 0,
        })
      : clientApiCall(
          promise,
          { message: "", events: [], totalEvents: 0, totalPages: 0 },
          false
        );
  },

  fetchById(id: string, isServer = false) {
    const promise = fetchClient
      .get<EventDetailResponse>(`/get-event/${id}`)
      .then((res) => res.data.event);

    return isServer
      ? serverApiCall(promise, {} as Event)
      : clientApiCall(promise, {} as Event, false);
  },

  create(eventData: EventCreateInput, isServer = false) {
    // Create FormData for file upload
    const formData = new FormData();

    Object.entries(eventData).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === "docs" && Array.isArray(value)) {
          value.forEach((file) => {
            formData.append("docs", file);
          });
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const promise = fetchClient
      .post<{ message: string }>("/add-event", formData)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" });
  },

  update(id: string, eventData: Partial<EventCreateInput>, isServer = false) {
    // Create FormData for file upload if needed
    const formData = new FormData();
    Object.entries(eventData).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === "docs" && Array.isArray(value)) {
          value.forEach((file) => {
            formData.append("docs", file);
          });
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const promise = fetchClient
      .put<{ message: string }>(`/edit-event/${id}`, formData)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" });
  },

  delete(id: string, isServer = false) {
    const promise = fetchClient
      .delete<{ message: string }>(`/delete-event/${id}`)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" });
  },
};
