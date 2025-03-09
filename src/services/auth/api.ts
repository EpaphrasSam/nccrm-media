import { fetchClient } from "@/utils/fetch-client";
import { clientApiCall } from "@/utils/api-wrapper";
import { signIn, signOut } from "next-auth/react";
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

export const authService = {
  login(credentials: LoginCredentials) {
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
    return clientApiCall(promise, null, false);
  },

  logout() {
    const promise = signOut().then(() => null);
    return clientApiCall(promise, null, false);
  },

  signup(signupData: SignupData) {
    console.log(signupData);
    const promise = fetchClient
      .post<AuthResponse>("/auth/signup", signupData)
      .then((res) => res.data);
    return clientApiCall(promise, {} as AuthResponse);
  },

  forgotPassword(data: ForgotPasswordData) {
    const promise = fetchClient
      .post("/auth/forgot-password", data)
      .then((res) => res.data);
    return clientApiCall(promise, {});
  },

  resetPassword(data: ResetPasswordData) {
    const promise = fetchClient
      .post("/auth/reset-password", data)
      .then((res) => res.data);
    return clientApiCall(promise, {});
  },

  changePassword(data: ChangePasswordData) {
    const promise = fetchClient
      .post("/auth/change-password", data)
      .then((res) => res.data);
    return clientApiCall(promise, {});
  },

  getDepartment() {
    const promise = fetchClient
      .get<Department[]>("/get-departments")
      .then((res) => res.data);
    return clientApiCall(promise, [], false);
  },
};
