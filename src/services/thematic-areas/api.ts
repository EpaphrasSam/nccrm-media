import { fetchClient } from "@/utils/fetch-client";
import { clientApiCall, serverApiCall } from "@/utils/api-wrapper";
import type {
  ThematicArea,
  ThematicAreaListResponse,
  ThematicAreaDetailResponse,
  ThematicAreaCreateInput,
  ThematicAreaUpdateInput,
  ThematicAreaQueryParams,
} from "./types";

export const thematicAreaService = {
  fetchAll(params?: Partial<ThematicAreaQueryParams>, isServer = false) {
    const promise = fetchClient
      .get<ThematicAreaListResponse>("/admin/all-thematic-areas", {
        params: {
          page: params?.page || 1,
          limit: params?.limit || 20,
          ...(params?.search && { search: params.search }),
        },
      })
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, {
          message: "",
          thematicAreas: [],
          totalThematicAreas: 0,
          totalPages: 0,
        })
      : clientApiCall(
          promise,
          {
            message: "",
            thematicAreas: [],
            totalThematicAreas: 0,
            totalPages: 0,
          },
          false
        );
  },

  fetchById(id: string, isServer = false) {
    const promise = fetchClient
      .get<ThematicAreaDetailResponse>(`/admin/thematic-area/${id}`)
      .then((res) => res.data.thematicArea);

    return isServer
      ? serverApiCall(promise, {} as ThematicArea)
      : clientApiCall(promise, {} as ThematicArea, false);
  },

  create(data: ThematicAreaCreateInput, isServer = false) {
    const promise = fetchClient
      .post<{ message: string }>("/admin/add-thematic-area", data)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" });
  },

  update(id: string, data: ThematicAreaUpdateInput, isServer = false) {
    const promise = fetchClient
      .put<{ message: string }>(`/admin/edit-thematic-area/${id}`, data)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" });
  },

  delete(id: string, isServer = false) {
    const promise = fetchClient
      .delete<{ message: string }>(`/admin/delete-thematic-area/${id}`)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" });
  },
};
