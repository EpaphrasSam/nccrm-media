import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { AuthResponse, LoginCredentials } from "@/services/auth/types";
import { AuthErrorClasses } from "@/services/auth/errors";
import axios from "./axios";

const authRoutes = ["/login", "/signup", "/forgot-password"];

async function loginWithCredentials(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  try {
    const response = await axios.post<AuthResponse>("/auth/login", credentials);
    console.log("user", response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const authConfig = {
  pages: {
    signIn: "/login",
    signOut: "/login",
  },
  events: {
    signIn: async (message) => {
      console.log("signIn", message);
    },
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdmin = auth?.user?.role === "admin";
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
        if (!isLoggedIn) return false;
        if (!isAdmin) return false;
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
        id: token.id as string,
        email: token.email as string,
        name: token.name as string,
        role: token.role as string,
        token: token.token as string,
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
