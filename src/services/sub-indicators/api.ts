import { fetchClient } from "@/utils/fetch-client";
import { BASE_URL } from "@/utils/axios";
import { clientApiCall, serverApiCall } from "@/utils/api-wrapper";
import type {
  SubIndicatorDetail,
  SubIndicatorCreateInput,
  SubIndicatorUpdateInput,
  SubIndicatorQueryParams,
  SubIndicatorListResponse,
  SubIndicatorDetailResponse,
} from "./types";

export const subIndicatorService = {
  fetchAll(params?: Partial<SubIndicatorQueryParams>, isServer = false) {
    const promise = fetchClient
      .get<SubIndicatorListResponse>(`${BASE_URL}/admin/all-sub-indicators`, {
        params: {
          page: params?.page || 1,
          limit: params?.limit || 20,
          main_indicator: params?.main_indicator,
        },
      })
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, {
          message: "",
          subIndicators: [],
          totalSubIndicators: 0,
          totalPages: 0,
        })
      : clientApiCall(
          promise,
          {
            message: "",
            subIndicators: [],
            totalSubIndicators: 0,
            totalPages: 0,
          },
          false
        );
  },

  fetchById(id: string, isServer = false) {
    const promise = fetchClient
      .get<SubIndicatorDetailResponse>(`${BASE_URL}/admin/sub-indicator/${id}`)
      .then((res) => res.data.subIndicator);

    return isServer
      ? serverApiCall(promise, {} as SubIndicatorDetail)
      : clientApiCall(promise, {} as SubIndicatorDetail, false);
  },

  create(data: SubIndicatorCreateInput, isServer = false) {
    const promise = fetchClient
      .post<{ message: string }>(`${BASE_URL}/admin/add-sub-indicator`, data)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" });
  },

  update(id: string, data: SubIndicatorUpdateInput, isServer = false) {
    const promise = fetchClient
      .put<{ message: string }>(
        `${BASE_URL}/admin/edit-sub-indicator/${id}`,
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
        `${BASE_URL}/admin/delete-sub-indicator/${id}`
      )
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" });
  },
};
