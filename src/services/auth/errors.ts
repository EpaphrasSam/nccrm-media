// src/services/auth/errors.ts
import { CredentialsSignin } from "next-auth";

export const AUTH_ERRORS = {
  USER_NOT_FOUND: {
    code: "404",
    message: "User not found",
  },
  INVALID_PASSWORD: {
    code: "400",
    message: "Invalid password",
  },
  UNVERIFIED_ACCOUNT: {
    code: "403",
    message: "Account not approved, please contact your administrator",
  },
  DEACTIVATED_ACCOUNT: {
    code: "405",
    message: "Account has been deactivated, please contact your administrator",
  },
  TOO_MANY_ATTEMPTS: {
    code: "429",
    message: "Too many login attempts, please try again later",
  },
  INVALID_CREDENTIALS: {
    code: "401",
    message: "Invalid credentials",
  },
  INTERNAL_SERVER_ERROR: {
    code: "500",
    message: "Internal server error",
  },
} as const;

// Create error classes dynamically
export const AuthErrorClasses = Object.entries(AUTH_ERRORS).reduce(
  (acc, [, value]) => {
    acc[value.code] = class extends CredentialsSignin {
      code = value.code;
    };
    return acc;
  },
  {} as Record<string, typeof CredentialsSignin>
);

export type AuthErrorCode =
  (typeof AUTH_ERRORS)[keyof typeof AUTH_ERRORS]["code"];
export const AUTH_ERROR_MESSAGES = Object.values(AUTH_ERRORS).reduce(
  (acc, { code, message }) => {
    acc[code] = message;
    return acc;
  },
  {} as Record<string, string>
);
