import { clientApiCall, serverApiCall } from "@/utils/api-wrapper";
import type {
  UserListResponse,
  UserDetailResponse,
  UserCreateInput,
  UserUpdateInput,
  UserValidateInput,
  UserQueryParams,
} from "./types";
import { fetchClient } from "@/utils/fetch-client";
import type { AuthResponse } from "@/services/auth/types";

// Export ApiOptions type
export type ApiOptions = {
  handleError?: (error: string) => void;
};

export const userService = {
  fetchAll(
    params: UserQueryParams = {},
    isServer = false,
    options?: ApiOptions
  ) {
    const promise = fetchClient
      .get<UserListResponse>(`/admin/all-users`, {
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          ...(params.department && { department: params.department }),
          ...(params.role && { role: params.role }),
          ...(params.search && { search: params.search }),
        },
      })
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, {
          message: "",
          users: [],
          totalUsers: 0,
          totalPages: 0,
        })
      : clientApiCall(
          promise,
          {
            message: "",
            users: [],
            totalUsers: 0,
            totalPages: 0,
          },
          false, // No success message for fetching
          options
        );
  },

  fetchById(id: string, isServer = false, options?: ApiOptions) {
    const promise = fetchClient
      .get<UserDetailResponse>(`/admin/user/${id}`)
      .then((res) => res.data.user);

    return isServer
      ? serverApiCall(promise, null)
      : clientApiCall(promise, null, false, options); // No success message for fetching
  },

  create(userData: UserCreateInput, isServer = false, options?: ApiOptions) {
    const promise = fetchClient
      .post<{ message: string }>(`/admin/add-user`, userData)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" }, true, options); // Keep success message
  },

  update(
    id: string,
    userData: UserUpdateInput,
    isServer = false,
    options?: ApiOptions
  ) {
    let promise;

    // If there's an image, use FormData
    if (userData.image) {
      const formData = new FormData();
      Object.entries(userData).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key === "image" && value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, String(value));
          }
        }
      });
      promise = fetchClient
        .put<{ message: string }>(`/admin/edit-user/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => res.data);
    } else {
      // If no image, send JSON
      promise = fetchClient
        .put<{ message: string }>(`/admin/edit-user/${id}`, userData)
        .then((res) => res.data);
    }

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" }, true, options); // Keep success message
  },

  delete(id: string, isServer = false, options?: ApiOptions) {
    const promise = fetchClient
      .delete<{ message: string }>(`/admin/delete-user/${id}`)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" }, true, options); // Keep success message
  },

  validate(
    id: string,
    status: UserValidateInput,
    isServer = false,
    options?: ApiOptions
  ) {
    const promise = fetchClient
      .put<{ message: string }>(`/admin/validate-user/${id}`, status)
      .then((res) => res.data);

    return isServer
      ? serverApiCall(promise, { message: "" })
      : clientApiCall(promise, { message: "" }, true, options); // Keep success message
  },

  async fetchCurrentUser(id: string) {
    const data = await fetchClient
      .get<{ user: AuthResponse }>(`/get-user/${id}`)
      .then((res) => res.data.user)
      .catch((error) => {
        console.error(
          "Failed to fetch current user for session update:",
          error
        );
        return null;
      });
    return data;
  },
};
