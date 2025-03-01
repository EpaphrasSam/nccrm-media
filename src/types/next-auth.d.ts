import type { DefaultSession } from "next-auth";
import type { AuthResponse } from "@/services/auth/types";

declare module "next-auth" {
  interface Session {
    user: AuthResponse & DefaultSession["user"];
  }

  type User = AuthResponse;
}

declare module "next-auth/jwt" {
  interface JWT extends AuthResponse {
    exp?: number;
    iat?: number;
    jti?: string;
    sub?: string;
  }
}

// Add types for auth config
declare module "next-auth/core" {
  interface AuthConfig {
    pages?: {
      signIn: string;
    };
    callbacks?: {
      authorized?: (params: {
        auth: { user: User } | null;
        request: { nextUrl: URL };
      }) => Promise<boolean> | boolean;
      jwt?: (params: { token: JWT; user: User | null }) => Promise<JWT> | JWT;
      session?: (params: {
        session: Session;
        token: JWT;
      }) => Promise<Session> | Session;
    };
  }
}
