import { fetchClient } from "@/utils/fetch-client";
import { clientApiCall, serverApiCall } from "@/utils/api-wrapper";
import type {
  Role,
  RoleListResponse,
  RoleDetailResponse,
  RoleCreateInput,
  RoleUpdateInput,
  RoleQueryParams,
} from "./types";

type ApiOptions = {
  handleError?: (error: string) => void;
};

export const roleService = {
  fetchAll: async (
    params?: Partial<RoleQueryParams>,
    isServer = false,
    options?: ApiOptions
  ) => {
    const promise = fetchClient
      .get<RoleListResponse>("/admin/all-roles", {
        params: {
          ...(params?.page && { page: params.page }),
          ...(params?.limit && { limit: params.limit }),
          ...(params?.search && { search: params.search }),
        },
      })
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, {
          message: "",
          roles: [],
          totalRoles: 0,
          totalPages: 0,
        })
      : clientApiCall(
          promise,
          {
            message: "",
            roles: [],
            totalRoles: 0,
            totalPages: 0,
          },
          false,
          options
        );
  },

  fetchById: async (id: string, isServer = false, options?: ApiOptions) => {
    const promise = fetchClient
      .get<RoleDetailResponse>(`/admin/role/${id}`)
      .then((res) => res.data.role);

    return isServer
      ? serverApiCall(promise, {} as Role)
      : clientApiCall(promise, {} as Role, false, options);
  },

  create: async (
    data: RoleCreateInput,
    isServer = false,
    options?: ApiOptions
  ) => {
    const promise = fetchClient
      .post<{ message: string }>("/admin/add-role", data)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" }, true, options);
  },

  update: async (
    id: string,
    data: RoleUpdateInput,
    isServer = false,
    options?: ApiOptions
  ) => {
    const promise = fetchClient
      .put<{ message: string }>(`/admin/edit-role/${id}`, data)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" }, true, options);
  },

  delete: async (id: string, isServer = false, options?: ApiOptions) => {
    const promise = fetchClient
      .delete<{ message: string }>(`/admin/delete-role/${id}`)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" }, true, options);
  },
};
