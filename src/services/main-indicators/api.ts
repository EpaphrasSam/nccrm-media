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

type ApiOptions = {
  handleError?: (error: string) => void;
};

export const mainIndicatorService = {
  fetchAll(
    params?: Partial<MainIndicatorQueryParams>,
    isServer = false,
    options?: ApiOptions
  ) {
    const promise = fetchClient
      .get<MainIndicatorListResponse>("/admin/all-main-indicators", {
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
          false,
          options
        );
  },

  fetchById(id: string, isServer = false, options?: ApiOptions) {
    const promise = fetchClient
      .get<MainIndicatorDetailResponse>(`/admin/main-indicator/${id}`)
      .then((res) => res.data.mainIndicator);

    return isServer
      ? serverApiCall(promise, {} as MainIndicatorDetail)
      : clientApiCall(promise, {} as MainIndicatorDetail, false, options);
  },

  create(
    data: MainIndicatorCreateInput,
    isServer = false,
    options?: ApiOptions
  ) {
    const promise = fetchClient
      .post<{ message: string }>("/admin/add-main-indicator", data)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" }, true, options);
  },

  update(
    id: string,
    data: MainIndicatorUpdateInput,
    isServer = false,
    options?: ApiOptions
  ) {
    const promise = fetchClient
      .put<{ message: string }>(`/admin/edit-main-indicator/${id}`, data)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" }, true, options);
  },

  delete(id: string, isServer = false, options?: ApiOptions) {
    const promise = fetchClient
      .delete<{ message: string }>(`/admin/delete-main-indicator/${id}`)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" }, true, options);
  },
};
