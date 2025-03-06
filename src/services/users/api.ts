import axios from "@/utils/axios";
import { clientApiCall, serverApiCall } from "@/utils/api-wrapper";
import type {
  UserListResponse,
  UserDetailResponse,
  UserCreateInput,
  UserUpdateInput,
  UserValidateInput,
  UserQueryParams,
} from "./types";

// Simulating API call with mock data
export function fetchUsers(params: UserQueryParams = {}, isServer = false) {
  const promise = axios
    .get<UserListResponse>("/admin/all-users", {
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
        false // No success message for fetching
      );
}

export function fetchUserById(id: string, isServer = false) {
  const promise = axios
    .get<UserDetailResponse>(`/admin/user/${id}`)
    .then((res) => res.data.user);

  return isServer
    ? serverApiCall(promise, null)
    : clientApiCall(promise, null, false); // No success message for fetching
}

export function createUser(userData: UserCreateInput, isServer = false) {
  const promise = axios
    .post<{ message: string }>("/admin/add-user", userData)
    .then((res) => res.data);

  return isServer
    ? serverApiCall(promise, { message: "" })
    : clientApiCall(promise, { message: "" }); // Keep success message
}

export function updateUser(
  id: string,
  userData: UserUpdateInput,
  isServer = false
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
    promise = axios
      .put<{ message: string }>(`/admin/edit-user/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => res.data);
  } else {
    // If no image, send JSON
    promise = axios
      .put<{ message: string }>(`/admin/edit-user/${id}`, userData)
      .then((res) => res.data);
  }

  return isServer
    ? serverApiCall(promise, { message: "" })
    : clientApiCall(promise, { message: "" }); // Keep success message
}

export function deleteUser(id: string, isServer = false) {
  const promise = axios
    .delete<{ message: string }>(`/admin/delete-user/${id}`)
    .then((res) => res.data);

  return isServer
    ? serverApiCall(promise, { message: "" })
    : clientApiCall(promise, { message: "" }); // Keep success message
}

export function validateUser(
  id: string,
  status: UserValidateInput,
  isServer = false
) {
  const promise = axios
    .put<{ message: string }>(`/admin/validate-user/${id}`, status)
    .then((res) => res.data);

  return isServer
    ? serverApiCall(promise, { message: "" })
    : clientApiCall(promise, { message: "" }); // Keep success message
}
