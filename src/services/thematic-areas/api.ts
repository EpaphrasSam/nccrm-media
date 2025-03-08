import axios from "@/utils/axios";
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
  fetchAll(params: ThematicAreaQueryParams = {}, isServer = false) {
    const promise = axios
      .get<ThematicAreaListResponse>("/admin/all-thematic-areas", {
        params: {
          page: params.page || 1,
          limit: params.limit || 20,
        },
      })
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, {
          message: "",
          thematicAreas: [],
          totalPages: 0,
          totalThematicAreas: 0,
        })
      : clientApiCall(
          promise,
          {
            message: "",
            thematicAreas: [],
            totalPages: 0,
            totalThematicAreas: 0,
          },
          false
        );
  },

  fetchById(id: string, isServer = false) {
    const promise = axios
      .get<ThematicAreaDetailResponse>(`/admin/thematic-area/${id}`)
      .then((res) => res.data.thematicArea);

    return isServer
      ? serverApiCall(promise, {} as ThematicArea)
      : clientApiCall(promise, {} as ThematicArea, false);
  },

  create(thematicArea: ThematicAreaCreateInput, isServer = false) {
    const promise = axios
      .post<{ message: string }>("/admin/add-thematic-area", thematicArea)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" });
  },

  update(id: string, thematicArea: ThematicAreaUpdateInput, isServer = false) {
    const promise = axios
      .put<{ message: string }>(`/admin/edit-thematic-area/${id}`, thematicArea)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" });
  },

  delete(id: string, isServer = false) {
    const promise = axios
      .delete<{ message: string }>(`/admin/delete-thematic-area/${id}`)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" });
  },
};
