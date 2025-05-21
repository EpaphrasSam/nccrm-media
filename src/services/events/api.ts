import { fetchClient } from "@/utils/fetch-client";
import { clientApiCall, serverApiCall } from "@/utils/api-wrapper";
import type {
  Event,
  EventListResponse,
  EventDetailResponse,
  EventCreateInput,
  EventUpdateInput,
  EventQueryParams,
  EventValidateInput,
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
          ...(params.page && { page: params.page }),
          ...(params.limit && { limit: params.limit }),
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

  fetchById(
    id: string,
    userId: string,
    isServer = false,
    options?: ApiOptions
  ) {
    const promise = fetchClient
      .get<EventDetailResponse>(`/get-event/${id}/${userId}`)
      .then((res) => res.data.event);

    return isServer
      ? serverApiCall(promise, {} as Event)
      : clientApiCall(promise, {} as Event, false, options);
  },

  create(data: EventCreateInput, isServer = false, options?: ApiOptions) {
    const formData = new FormData();

    // Append all non-file fields
    Object.entries(data).forEach(([key, value]) => {
      if (key !== "docs" && value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach((item) => formData.append(key, item));
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    // Append files
    if (data.docs) {
      data.docs.forEach((file) => {
        formData.append("docs", file);
      });
    }

    const promise = fetchClient
      .post<{ message: string }>("/add-event", formData)
      .then((res) => res.data)
      .catch((error) => {
        const message =
          error.response?.data?.message || "Failed to create event";
        if (options?.handleError) {
          options.handleError(message);
        }
        throw error;
      });

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" }, true, options);
  },

  update(
    id: string,
    data: EventUpdateInput,
    isServer = false,
    options?: ApiOptions
  ) {
    const formData = new FormData();

    // Append all non-file fields
    Object.entries(data).forEach(([key, value]) => {
      if (!["files", "newDocs"].includes(key) && value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach((item) => formData.append(key, item));
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    // Append existing file URLs
    if (data.files) {
      data.files.forEach((url) => {
        formData.append("files", url);
      });
    }

    // Append new files
    if (data.newDocs) {
      data.newDocs.forEach((file) => {
        formData.append("newDocs", file);
      });
    }

    const promise = fetchClient
      .put<{ message: string }>(`/edit-event/${id}`, formData)
      .then((res) => res.data)
      .catch((error) => {
        const message =
          error.response?.data?.message || "Failed to update event";
        if (options?.handleError) {
          options.handleError(message);
        }
        throw error;
      });

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
  validate(
    id: string,
    status: EventValidateInput,
    isServer = false,
    options?: ApiOptions
  ) {
    const promise = fetchClient
      .put<{ message: string }>(`/admin//update-event-status/${id}`, status)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" }, true, options); // Keep success message
  },
};
