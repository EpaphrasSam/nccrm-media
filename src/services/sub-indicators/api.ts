import { fetchClient } from "@/utils/fetch-client";
import { clientApiCall, serverApiCall } from "@/utils/api-wrapper";
import type {
  SubIndicatorDetail,
  SubIndicatorCreateInput,
  SubIndicatorUpdateInput,
  SubIndicatorQueryParams,
  SubIndicatorListResponse,
  SubIndicatorDetailResponse,
} from "./types";

type ApiOptions = {
  handleError?: (error: string) => void;
};

export const subIndicatorService = {
  fetchAll(
    params?: Partial<SubIndicatorQueryParams>,
    isServer = false,
    options?: ApiOptions
  ) {
    const promise = fetchClient
      .get<SubIndicatorListResponse>("/admin/all-sub-indicators", {
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
          false,
          options
        );
  },

  fetchById(id: string, isServer = false, options?: ApiOptions) {
    const promise = fetchClient
      .get<SubIndicatorDetailResponse>(`/admin/sub-indicator/${id}`)
      .then((res) => res.data.subIndicator);

    return isServer
      ? serverApiCall(promise, {} as SubIndicatorDetail)
      : clientApiCall(promise, {} as SubIndicatorDetail, false, options);
  },

  create(
    data: SubIndicatorCreateInput,
    isServer = false,
    options?: ApiOptions
  ) {
    const promise = fetchClient
      .post<{ message: string }>("/admin/add-sub-indicator", data)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" }, true, options);
  },

  update(
    id: string,
    data: SubIndicatorUpdateInput,
    isServer = false,
    options?: ApiOptions
  ) {
    const promise = fetchClient
      .put<{ message: string }>(`/admin/edit-sub-indicator/${id}`, data)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" }, true, options);
  },

  delete(id: string, isServer = false, options?: ApiOptions) {
    const promise = fetchClient
      .delete<{ message: string }>(`/admin/delete-sub-indicator/${id}`)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" }, true, options);
  },
};
