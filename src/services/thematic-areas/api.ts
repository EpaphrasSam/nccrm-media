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

type ApiOptions = {
  handleError?: (error: string) => void;
};

export const thematicAreaService = {
  fetchAll(
    params?: Partial<ThematicAreaQueryParams>,
    isServer = false,
    options?: ApiOptions
  ) {
    const promise = fetchClient
      .get<ThematicAreaListResponse>("/admin/all-thematic-areas", {
        params: {
          ...(params?.page && { page: params.page }),
          ...(params?.limit && { limit: params.limit }),
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
          false,
          options
        );
  },

  fetchById(id: string, isServer = false, options?: ApiOptions) {
    const promise = fetchClient
      .get<ThematicAreaDetailResponse>(`/admin/thematic-area/${id}`)
      .then((res) => res.data.thematicArea);

    return isServer
      ? serverApiCall(promise, {} as ThematicArea)
      : clientApiCall(promise, {} as ThematicArea, false, options);
  },

  create(
    data: ThematicAreaCreateInput,
    isServer = false,
    options?: ApiOptions
  ) {
    const promise = fetchClient
      .post<{ message: string }>("/admin/add-thematic-area", data)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" }, true, options);
  },

  update(
    id: string,
    data: ThematicAreaUpdateInput,
    isServer = false,
    options?: ApiOptions
  ) {
    const promise = fetchClient
      .put<{ message: string }>(`/admin/edit-thematic-area/${id}`, data)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" }, true, options);
  },

  delete(id: string, isServer = false, options?: ApiOptions) {
    const promise = fetchClient
      .delete<{ message: string }>(`/admin/delete-thematic-area/${id}`)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" }, true, options);
  },
};
