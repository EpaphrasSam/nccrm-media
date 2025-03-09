import { fetchClient } from "@/utils/fetch-client";
import { BASE_URL } from "@/utils/axios";
import { clientApiCall, serverApiCall } from "@/utils/api-wrapper";
import type {
  Department,
  DepartmentListResponse,
  DepartmentDetailResponse,
  DepartmentCreateInput,
  DepartmentUpdateInput,
  DepartmentQueryParams,
} from "./types";

export const departmentService = {
  fetchAll(params: DepartmentQueryParams = {}, isServer = false) {
    const promise = fetchClient
      .get<DepartmentListResponse>(`${BASE_URL}/admin/all-departments`, {
        params: {
          page: params.page || 1,
          limit: params.limit || 20,
          ...(params.search && { search: params.search }),
        },
      })
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, {
          message: "",
          departments: [] as Department[],
          totalDepartments: 0,
          totalPages: 0,
        })
      : clientApiCall(
          promise,
          {
            message: "",
            departments: [] as Department[],
            totalDepartments: 0,
            totalPages: 0,
          },
          false
        );
  },

  fetchById(id: string, isServer = false) {
    const promise = fetchClient
      .get<DepartmentDetailResponse>(`${BASE_URL}/admin/department/${id}`)
      .then((res) => res.data.department);

    return isServer
      ? serverApiCall(promise, {} as Department)
      : clientApiCall(promise, {} as Department, false);
  },

  create(data: DepartmentCreateInput, isServer = false) {
    const promise = fetchClient
      .post<{ message: string }>(`${BASE_URL}/admin/add-department`, data)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" });
  },

  update(id: string, data: DepartmentUpdateInput, isServer = false) {
    const promise = fetchClient
      .put<{ message: string }>(`${BASE_URL}/admin/edit-department/${id}`, data)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" });
  },

  delete(id: string, isServer = false) {
    const promise = fetchClient
      .delete<{ message: string }>(`${BASE_URL}/admin/delete-department/${id}`)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" });
  },
};
