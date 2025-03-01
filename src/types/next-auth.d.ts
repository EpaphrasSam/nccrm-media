import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      token: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string;
    token: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    token: string;
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
