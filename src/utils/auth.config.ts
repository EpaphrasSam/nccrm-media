import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type {
  AuthResponse,
  LoginCredentials,
  RoleFunctions,
} from "@/services/auth/types";
import { AuthErrorClasses } from "@/services/auth/errors";
import axios from "./axios";

interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: {
      id: string;
      name: string;
      functions: RoleFunctions;
    } | null;
    department: string | null;
    gender: string | null;
    image: string | null;
    phone_number: string | null;
    status: string;
    username: string;
    created_at: string;
    updated_at: string;
  };
  token: string;
}

const authRoutes = ["/login", "/signup", "/forgot-password"];

async function loginWithCredentials(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  try {
    const response = await axios.post<LoginResponse>(
      "/auth/login",
      credentials
    );
    const { user, token } = response.data;

    // Role check - uncomment when ready to enforce role requirement
    /* if (!user.role) {
      const error: any = new Error("Account not verified");
      error.response = { status: 403 }; // Will map to UNVERIFIED_ACCOUNT
      throw error;
    } */

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
        ? {
            id: user.role.id,
            name: user.role.name,
            functions: user.role.functions,
          }
        : null,
      token,
      department: user.department,
      gender: user.gender,
      image: user.image,
      phone_number: user.phone_number,
      status: user.status,
      username: user.username,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  } catch (error) {
    throw error;
  }
}

export const authConfig = {
  pages: {
    signIn: "/login",
    signOut: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdmin = auth?.user?.role?.name === "superadmin";
      const isAuthRoute = authRoutes.some((route) =>
        nextUrl.pathname.startsWith(route)
      );
      const isAdminRoute = nextUrl.pathname.startsWith("/admin");

      if (isAuthRoute) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/", nextUrl));
        }
        return true;
      }

      if (isAdminRoute) {
        if (!isLoggedIn || !isAdmin) {
          return Response.redirect(new URL("/", nextUrl));
        }
        return true;
      }

      if (!isLoggedIn) return false;
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session) {
        return { ...token, ...session.user };
      }

      if (user) {
        return { ...token, ...user };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        ...(token as unknown as AuthResponse),
      };
      return session;
    },
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const loginData: LoginCredentials = {
            email: credentials.email as string,
            password: credentials.password as string,
          };

          const user = await loginWithCredentials(loginData);
          return user;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          const statusCode = error.response?.status || 400;
          const ErrorClass =
            AuthErrorClasses[statusCode] || AuthErrorClasses["400"];
          throw new ErrorClass();
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
