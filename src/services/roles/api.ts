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
  fetchAll(params: RoleQueryParams = {}, isServer = false) {
    const promise = axios
      .get<RoleListResponse>("/admin/all-roles", {
        params: {
          page: params.page || 1,
          limit: params.limit || 20,
        },
      })
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "", roles: [] })
      : clientApiCall(promise, { message: "", roles: [] }, false);
  },

  fetchById(id: string, isServer = false) {
    const promise = axios
      .get<RoleDetailResponse>(`/admin/role/${id}`)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "", role: {} as Role })
      : clientApiCall(promise, { message: "", role: {} as Role }, false);
  },

  create(role: RoleCreateInput, isServer = false) {
    const promise = axios
      .post<{ message: string }>("/admin/add-role", role)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" });
  },

  update(id: string, role: RoleUpdateInput, isServer = false) {
    const promise = axios
      .put<{ message: string }>(`/admin/edit-role/${id}`, role)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" });
  },

  delete(id: string, isServer = false) {
    const promise = axios
      .delete<{ message: string }>(`/admin/delete-role/${id}`)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" });
  },
};
