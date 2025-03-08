import axios from "@/utils/axios";
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
  fetchAll(params: RegionQueryParams = {}, isServer = false) {
    const promise = axios
      .get<RegionListResponse>("/admin/all-regions", {
        params: {
          page: params.page || 1,
          limit: params.limit || 20,
        },
      })
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, {
          message: "",
          regions: [],
          totalPages: 0,
          totalRegions: 0,
        })
      : clientApiCall(
          promise,
          { message: "", regions: [], totalPages: 0, totalRegions: 0 },
          false
        );
  },

  fetchById(id: string, isServer = false) {
    const promise = axios
      .get<RegionDetailResponse>(`/admin/region/${id}`)
      .then((res) => res.data.region);

    return isServer
      ? serverApiCall(promise, {} as Region)
      : clientApiCall(promise, {} as Region, false);
  },

  create(region: RegionCreateInput, isServer = false) {
    const promise = axios
      .post<{ message: string }>("/admin/add-region", region)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" });
  },

  update(id: string, region: RegionUpdateInput, isServer = false) {
    const promise = axios
      .put<{ message: string }>(`/admin/edit-region/${id}`, region)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" });
  },

  delete(id: string, isServer = false) {
    const promise = axios
      .delete<{ message: string }>(`/admin/delete-region/${id}`)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" });
  },
};
