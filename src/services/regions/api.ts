import { fetchClient } from "@/utils/fetch-client";
import { BASE_URL } from "@/utils/axios";
import { clientApiCall, serverApiCall } from "@/utils/api-wrapper";
import type {
  Region,
  RegionListResponse,
  RegionDetailResponse,
  RegionCreateInput,
  RegionUpdateInput,
  RegionQueryParams,
} from "./types";

export const regionService = {
  fetchAll(params?: Partial<RegionQueryParams>, isServer = false) {
    const promise = fetchClient
      .get<RegionListResponse>(`${BASE_URL}/admin/all-regions`, {
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
          false
        );
  },

  fetchById(id: string, isServer = false) {
    const promise = fetchClient
      .get<RegionDetailResponse>(`${BASE_URL}/admin/region/${id}`)
      .then((res) => res.data.region);

    return isServer
      ? serverApiCall(promise, {} as Region)
      : clientApiCall(promise, {} as Region, false);
  },

  create(data: RegionCreateInput, isServer = false) {
    const promise = fetchClient
      .post<{ message: string }>(`${BASE_URL}/admin/add-region`, data)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" });
  },

  update(id: string, data: RegionUpdateInput, isServer = false) {
    const promise = fetchClient
      .put<{ message: string }>(`${BASE_URL}/admin/edit-region/${id}`, data)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" });
  },

  delete(id: string, isServer = false) {
    const promise = fetchClient
      .delete<{ message: string }>(`${BASE_URL}/admin/delete-region/${id}`)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" });
  },
};
