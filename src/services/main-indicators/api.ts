import { fetchClient } from "@/utils/fetch-client";
import { clientApiCall, serverApiCall } from "@/utils/api-wrapper";
import { BASE_URL } from "@/utils/axios";
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
      .get<MainIndicatorListResponse>(`${BASE_URL}/admin/all-main-indicators`, {
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
      .get<MainIndicatorDetailResponse>(
        `${BASE_URL}/admin/main-indicator/${id}`
      )
      .then((res) => res.data.mainIndicator);

    return isServer
      ? serverApiCall(promise, {} as MainIndicatorDetail)
      : clientApiCall(promise, {} as MainIndicatorDetail, false);
  },

  create(data: MainIndicatorCreateInput, isServer = false) {
    const promise = fetchClient
      .post<{ message: string }>(`${BASE_URL}/admin/add-main-indicator`, data)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" });
  },

  update(id: string, data: MainIndicatorUpdateInput, isServer = false) {
    const promise = fetchClient
      .put<{ message: string }>(
        `${BASE_URL}/admin/edit-main-indicator/${id}`,
        data
      )
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" });
  },

  delete(id: string, isServer = false) {
    const promise = fetchClient
      .delete<{ message: string }>(
        `${BASE_URL}/admin/delete-main-indicator/${id}`
      )
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" });
  },
};
