import axios from "@/utils/axios";
import { clientApiCall, serverApiCall } from "@/utils/api-wrapper";
import type {
  MainIndicatorWithThematicArea,
  MainIndicatorListResponse,
  MainIndicatorDetailResponse,
  MainIndicatorCreateInput,
  MainIndicatorUpdateInput,
  MainIndicatorQueryParams,
} from "./types";

export const mainIndicatorService = {
  fetchAll(params: MainIndicatorQueryParams = {}, isServer = false) {
    const promise = axios
      .get<MainIndicatorListResponse>("/admin/all-main-indicators", {
        params: {
          page: params.page || 1,
          limit: params.limit || 20,
          thematic_area_id: params.thematic_area_id,
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
    const promise = axios
      .get<MainIndicatorDetailResponse>(`/admin/main-indicator/${id}`)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, {
          message: "",
          mainIndicator: {} as MainIndicatorWithThematicArea,
        })
      : clientApiCall(
          promise,
          { message: "", mainIndicator: {} as MainIndicatorWithThematicArea },
          false
        );
  },

  create(mainIndicator: MainIndicatorCreateInput, isServer = false) {
    const promise = axios
      .post<{ message: string }>("/admin/add-main-indicator", mainIndicator)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" });
  },

  update(
    id: string,
    mainIndicator: MainIndicatorUpdateInput,
    isServer = false
  ) {
    const promise = axios
      .put<{ message: string }>(
        `/admin/edit-main-indicator/${id}`,
        mainIndicator
      )
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" });
  },

  delete(id: string, isServer = false) {
    const promise = axios
      .delete<{ message: string }>(`/admin/delete-main-indicator/${id}`)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" });
  },
};
