import { fetchClient } from "@/utils/fetch-client";
import { clientApiCall, serverApiCall } from "@/utils/api-wrapper";
import type {
  Region,
  RegionListResponse,
  RegionDetailResponse,
  RegionCreateInput,
  RegionUpdateInput,
  RegionQueryParams,
} from "./types";

type ApiOptions = {
  handleError?: (error: string) => void;
};

export const regionService = {
  fetchAll(
    params?: Partial<RegionQueryParams>,
    isServer = false,
    options?: ApiOptions
  ) {
    const promise = fetchClient
      .get<RegionListResponse>("/admin/all-regions", {
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
          regions: [],
          totalRegions: 0,
          totalPages: 0,
        })
      : clientApiCall(
          promise,
          {
            message: "",
            regions: [],
            totalRegions: 0,
            totalPages: 0,
          },
          false,
          options
        );
  },

  fetchById(id: string, isServer = false, options?: ApiOptions) {
    const promise = fetchClient
      .get<RegionDetailResponse>(`/admin/region/${id}`)
      .then((res) => res.data.region);

    return isServer
      ? serverApiCall(promise, {} as Region)
      : clientApiCall(promise, {} as Region, false, options);
  },

  create(data: RegionCreateInput, isServer = false, options?: ApiOptions) {
    const promise = fetchClient
      .post<{ message: string }>("/admin/add-region", data)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" }, true, options);
  },

  update(
    id: string,
    data: RegionUpdateInput,
    isServer = false,
    options?: ApiOptions
  ) {
    const promise = fetchClient
      .put<{ message: string }>(`/admin/edit-region/${id}`, data)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" }, true, options);
  },

  delete(id: string, isServer = false, options?: ApiOptions) {
    const promise = fetchClient
      .delete<{ message: string }>(`/admin/delete-region/${id}`)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" }, true, options);
  },
};
