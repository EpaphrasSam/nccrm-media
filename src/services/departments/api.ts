import axios from "@/utils/axios";
import { clientApiCall, serverApiCall } from "@/utils/api-wrapper";
import type { Department } from "./types";

export const departmentService = {
  fetchAll(isServer = false) {
    const promise = axios
      .get<Department[]>("/admin/all-departments")
      .then((res) => res.data);
    return isServer ? serverApiCall(promise, []) : clientApiCall(promise, []);
  },

  fetchById(id: string, isServer = false) {
    const promise = axios
      .get<Department>(`/admin/department/${id}`)
      .then((res) => res.data);
    return isServer
      ? serverApiCall(promise, {} as Department)
      : clientApiCall(promise, {} as Department);
  },

  add(department: Omit<Department, "id" | "createdAt">, isServer = false) {
    const promise = axios
      .post<Department>("/admin/add-department", department)
      .then((res) => res.data);
    return isServer
      ? serverApiCall(promise, {} as Department)
      : clientApiCall(promise, {} as Department);
  },

  update(id: string, department: Partial<Department>, isServer = false) {
    const promise = axios
      .patch<Department>(`/admin/update-department/${id}`, department)
      .then((res) => res.data);
    return isServer
      ? serverApiCall(promise, {} as Department)
      : clientApiCall(promise, {} as Department);
  },

  delete(id: string, isServer = false) {
    const promise = axios
      .delete<void>(`/admin/delete-department/${id}`)
      .then((res) => res.data);
    return isServer
      ? serverApiCall(promise, undefined)
      : clientApiCall(promise, undefined);
  },
};
