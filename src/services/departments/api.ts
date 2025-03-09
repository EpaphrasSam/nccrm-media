import { fetchClient } from "@/utils/fetch-client";
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
      .get<DepartmentListResponse>("/admin/all-departments", {
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
      .get<DepartmentDetailResponse>(`/admin/department/${id}`)
      .then((res) => res.data.department);

    return isServer
      ? serverApiCall(promise, {} as Department)
      : clientApiCall(promise, {} as Department, false);
  },

  create(data: DepartmentCreateInput, isServer = false) {
    const promise = fetchClient
      .post<{ message: string }>("/admin/add-department", data)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" });
  },

  update(id: string, data: DepartmentUpdateInput, isServer = false) {
    const promise = fetchClient
      .put<{ message: string }>(`/admin/edit-department/${id}`, data)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" });
  },

  delete(id: string, isServer = false) {
    const promise = fetchClient
      .delete<{ message: string }>(`/admin/delete-department/${id}`)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" });
  },
};
