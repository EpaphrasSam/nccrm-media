import { fetchClient, signOutWithSessionClear } from "@/utils/fetch-client";
import { clientApiCall } from "@/utils/api-wrapper";
import type {
  AuthResponse,
  LoginCredentials,
  SignupData,
  ForgotPasswordData,
  ResetPasswordData,
  ChangePasswordData,
} from "./types";
import { Department } from "../departments/types";
import type { ApiOptions } from "@/services/users/api";

interface LoginResponse {
  user: AuthResponse;
  token: string;
  message?: string;
}

export const authService = {
  async login(credentials: LoginCredentials) {
    const promise = fetchClient
      .post<LoginResponse>("/auth/login", credentials, {
        returnErrorStatus: true,
      })
      .then((res) => {
        const { user, token, ...rest } = res.data;
        if (user.status === "deactivated") {
          return Promise.reject(
            new Error(
              "Account has been deactivated, please contact your administrator"
            )
          );
        }
        if (user.status === "pending_verification") {
          return Promise.reject(
            new Error("Account not approved, please contact your administrator")
          );
        }
        return { ...user, token, ...rest };
      });
    return clientApiCall(promise, null, false);
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
