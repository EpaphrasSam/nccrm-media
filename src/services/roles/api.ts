import axios from "@/utils/axios";
import { clientApiCall, serverApiCall } from "@/utils/api-wrapper";
import type {
  Role,
  RoleListResponse,
  RoleDetailResponse,
  RoleCreateInput,
  RoleUpdateInput,
  RoleQueryParams,
} from "./types";

export const roleService = {
  fetchAll: async (params?: Partial<RoleQueryParams>, isServer = false) => {
    const promise = axios
      .get<RoleListResponse>("/admin/all-roles", {
        params: {
          page: params?.page || 1,
          limit: params?.limit || 10,
          search: params?.search || "",
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
          false
        );
  },

  fetchById: async (id: string, isServer = false) => {
    const promise = axios
      .get<RoleDetailResponse>(`/admin/role/${id}`)
      .then((res) => res.data.role);

    return isServer
      ? serverApiCall(promise, {} as Role)
      : clientApiCall(promise, {} as Role, false);
  },

  create: async (data: RoleCreateInput, isServer = false) => {
    const promise = axios
      .post<{ message: string; role: Role }>("/admin/add-role", data)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "", role: {} as Role })
      : clientApiCall(promise, { message: "", role: {} as Role });
  },

  update: async (id: string, data: RoleUpdateInput, isServer = false) => {
    const promise = axios
      .put<{ message: string; role: Role }>(`/admin/edit-role/${id}`, data)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "", role: {} as Role })
      : clientApiCall(promise, { message: "", role: {} as Role });
  },

  delete: async (id: string, isServer = false) => {
    const promise = axios
      .delete<{ message: string }>(`/admin/delete-role/${id}`)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" });
  },
};
