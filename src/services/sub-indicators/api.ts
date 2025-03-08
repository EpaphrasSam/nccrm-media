import axios from "@/utils/axios";
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
    const promise = axios
      .get<SubIndicatorListResponse>("/admin/all-sub-indicators", {
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
    const promise = axios
      .get<SubIndicatorDetailResponse>(`/admin/sub-indicator/${id}`)
      .then((res) => res.data.subIndicator);

    return isServer
      ? serverApiCall(promise, {} as SubIndicatorDetail)
      : clientApiCall(promise, {} as SubIndicatorDetail, false);
  },

  create(subIndicator: SubIndicatorCreateInput, isServer = false) {
    const promise = axios
      .post<{ message: string }>("/admin/add-sub-indicator", subIndicator)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" });
  },

  update(id: string, subIndicator: SubIndicatorUpdateInput, isServer = false) {
    const promise = axios
      .put<{ message: string }>(`/admin/edit-sub-indicator/${id}`, subIndicator)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" });
  },

  delete(id: string, isServer = false) {
    const promise = axios
      .delete<{ message: string }>(`/admin/delete-sub-indicator/${id}`)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" });
  },
};
