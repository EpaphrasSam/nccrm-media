import { fetchClient } from "@/utils/fetch-client";
import { clientApiCall, serverApiCall } from "@/utils/api-wrapper";
import type {
  Event,
  EventListResponse,
  EventDetailResponse,
  EventCreateInput,
  EventQueryParams,
} from "./types";

type ApiOptions = {
  handleError?: (error: string) => void;
};

export const eventService = {
  fetchAll(
    params: Partial<EventQueryParams> = {},
    isServer = false,
    options?: ApiOptions
  ) {
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
          false,
          options
        );
  },

  fetchById(id: string, isServer = false, options?: ApiOptions) {
    const promise = fetchClient
      .get<EventDetailResponse>(`/event/${id}`)
      .then((res) => res.data.event);

    return isServer
      ? serverApiCall(promise, {} as Event)
      : clientApiCall(promise, {} as Event, false, options);
  },

  create(data: EventCreateInput, isServer = false, options?: ApiOptions) {
    const promise = fetchClient
      .post<{ message: string }>("/add-event", data)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" }, true, options);
  },

  update(
    id: string,
    data: Partial<Event>,
    isServer = false,
    options?: ApiOptions
  ) {
    const promise = fetchClient
      .put<{ message: string }>(`/edit-event/${id}`, data)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" }, true, options);
  },

  delete(id: string, isServer = false, options?: ApiOptions) {
    const promise = fetchClient
      .delete<{ message: string }>(`/delete-event/${id}`)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" }, true, options);
  },
};
