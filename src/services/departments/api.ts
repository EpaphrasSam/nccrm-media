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

type ApiOptions = {
  handleError?: (error: string) => void;
};

export const departmentService = {
  fetchAll(
    params: DepartmentQueryParams = {},
    isServer = false,
    options?: ApiOptions
  ) {
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
          false,
          options
        );
  },

  fetchById(id: string, isServer = false, options?: ApiOptions) {
    const promise = fetchClient
      .get<DepartmentDetailResponse>(`/admin/department/${id}`)
      .then((res) => res.data.department);

    return isServer
      ? serverApiCall(promise, {} as Department)
      : clientApiCall(promise, {} as Department, false, options);
  },

  create(data: DepartmentCreateInput, isServer = false, options?: ApiOptions) {
    const promise = fetchClient
      .post<{ message: string }>("/admin/add-department", data)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" }, true, options);
  },

  update(
    id: string,
    data: DepartmentUpdateInput,
    isServer = false,
    options?: ApiOptions
  ) {
    const promise = fetchClient
      .put<{ message: string }>(`/admin/edit-department/${id}`, data)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" }, true, options);
  },

  delete(id: string, isServer = false, options?: ApiOptions) {
    const promise = fetchClient
      .delete<{ message: string }>(`/admin/delete-department/${id}`)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" }, true, options);
  },
};
