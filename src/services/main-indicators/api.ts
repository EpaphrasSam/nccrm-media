import { fetchClient } from "@/utils/fetch-client";
import { clientApiCall, serverApiCall } from "@/utils/api-wrapper";
import type {
  MainIndicatorDetail,
  MainIndicatorCreateInput,
  MainIndicatorUpdateInput,
  MainIndicatorQueryParams,
  MainIndicatorListResponse,
  MainIndicatorDetailResponse,
} from "./types";

export const mainIndicatorService = {
  fetchAll(params?: Partial<MainIndicatorQueryParams>, isServer = false) {
    const promise = fetchClient
      .get<MainIndicatorListResponse>("/admin/all-main-indicators", {
        params: {
          page: params?.page || 1,
          limit: params?.limit || 20,
          thematic_area: params?.thematic_area,
        },
      })
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, {
          message: "",
          mainIndicators: [],
          totalMainIndicators: 0,
          totalPages: 0,
        })
      : clientApiCall(
          promise,
          {
            message: "",
            mainIndicators: [],
            totalMainIndicators: 0,
            totalPages: 0,
          },
          false
        );
  },

  fetchById(id: string, isServer = false) {
    const promise = fetchClient
      .get<MainIndicatorDetailResponse>(`/admin/main-indicator/${id}`)
      .then((res) => res.data.mainIndicator);

    return isServer
      ? serverApiCall(promise, {} as MainIndicatorDetail)
      : clientApiCall(promise, {} as MainIndicatorDetail, false);
  },

  create(data: MainIndicatorCreateInput, isServer = false) {
    const promise = fetchClient
      .post<{ message: string }>("/admin/add-main-indicator", data)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" });
  },

  update(id: string, data: MainIndicatorUpdateInput, isServer = false) {
    const promise = fetchClient
      .put<{ message: string }>(`/admin/edit-main-indicator/${id}`, data)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" });
  },

  delete(id: string, isServer = false) {
    const promise = fetchClient
      .delete<{ message: string }>(`/admin/delete-main-indicator/${id}`)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" });
  },
};
