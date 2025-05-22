import { fetchClient, signOutWithSessionClear } from "@/utils/fetch-client";
import { clientApiCall } from "@/utils/api-wrapper";
import { signIn } from "next-auth/react";
import type {
  AuthResponse,
  LoginCredentials,
  SignupData,
  ForgotPasswordData,
  ResetPasswordData,
  ChangePasswordData,
} from "./types";
import { Department } from "../departments/types";
import { AUTH_ERROR_MESSAGES, type AuthErrorCode } from "./errors";
import type { ApiOptions } from "@/services/users/api";

export const authService = {
  login(credentials: LoginCredentials, options?: ApiOptions) {
    const promise = signIn("credentials", {
      ...credentials,
      redirect: false,
    }).then((result) => {
      if (result?.error) {
        const code = result.code as AuthErrorCode;
        throw new Error(AUTH_ERROR_MESSAGES[code] || "Authentication failed");
      }
      return result;
    });
    return clientApiCall(promise, null, false, options);
  },

  logout(options?: ApiOptions) {
    const promise = signOutWithSessionClear().then(() => null);
    return clientApiCall(promise, null, false, options);
  },

  signup(signupData: SignupData, options?: ApiOptions) {
    const promise = fetchClient
      .post<AuthResponse>("/auth/signup", signupData)
      .then((res) => res.data);
    return clientApiCall(promise, {} as AuthResponse, true, options);
  },

  forgotPassword(data: ForgotPasswordData, options?: ApiOptions) {
    const promise = fetchClient
      .post("/auth/reset-password", data)
      .then((res) => res.data);
    return clientApiCall(promise, {}, true, options);
  },

  resetPassword(data: ResetPasswordData, options?: ApiOptions) {
    const promise = fetchClient
      .post("/auth/update-password", data)
      .then((res) => res.data);
    return clientApiCall(promise, {}, true, options);
  },

  changePassword(data: ChangePasswordData, options?: ApiOptions) {
    const promise = fetchClient
      .post("/auth/change-password", data)
      .then((res) => res.data);
    return clientApiCall(promise, {}, true, options);
  },

  getDepartment(options?: ApiOptions) {
    const promise = fetchClient
      .get<Department[]>("/get-departments")
      .then((res) => res.data);
    return clientApiCall(promise, [], false, options);
  },
};
