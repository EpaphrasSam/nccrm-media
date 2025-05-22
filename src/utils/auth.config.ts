import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { AuthResponse, LoginCredentials } from "@/services/auth/types";
import { RolePermissions, BaseFunctions } from "@/services/roles/types";
import { AuthErrorClasses } from "@/services/auth/errors";
import { fetchClient } from "@/utils/fetch-client";

interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: {
      id: string;
      name: string;
      functions: RolePermissions;
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

const authRoutes = ["/login", "/signup", "/forgot-password", "/reset-password"];
const publicRoutes = ["/", "/settings", "/unauthorized", "/not-found"];

type PermissionModule = keyof RolePermissions;
type PermissionAction = keyof BaseFunctions;

const moduleMap: Record<string, PermissionModule | undefined> = {
  users: "user",
  roles: "role",
  departments: "department",
  "thematic-areas": "thematic_area",
  "main-indicators": "main_indicator",
  "sub-indicators": "sub_indicator",
  events: "event",
};

function checkPermission(
  permissions: RolePermissions | null | undefined,
  module: PermissionModule,
  action: PermissionAction
): boolean {
  return !!permissions?.[module]?.[action];
}

function hasAccessForPath(
  pathname: string,
  permissions: RolePermissions | null | undefined,
  nextUrl?: URL
): boolean | Response {
  const segments = pathname.split("/").filter(Boolean);

  if (publicRoutes.includes(pathname)) {
    return true;
  }

  if (pathname.startsWith("/situational-reporting")) {
    const subPath = pathname.substring("/situational-reporting".length);
    if (subPath === "" || /^\/[^\/]+$/.test(subPath)) {
      return checkPermission(permissions, "situational_report", "view");
    } else if (subPath === "/new") {
      return checkPermission(permissions, "situational_report", "add");
    } else if (subPath.endsWith("/edit")) {
      return checkPermission(permissions, "situational_report", "edit");
    } else if (subPath.endsWith("/analysis")) {
      return checkPermission(permissions, "situational_report", "view");
    } else if (subPath === "/overview-summary") {
      return checkPermission(permissions, "situational_report", "view");
    }
    return checkPermission(permissions, "situational_report", "view");
  }

  let moduleSegmentIndex = 0;
  if (segments[0] === "admin") {
    if (segments.length < 2) return true;
    moduleSegmentIndex = 1;
  }

  const moduleSegment = segments[moduleSegmentIndex];
  const permissionModule = moduleMap[moduleSegment];

  if (!permissionModule) {
    if (nextUrl) {
      return Response.redirect(new URL("/not-found", nextUrl));
    }
    return false;
  }

  let requiredAction: PermissionAction = "view";
  const lastSegment = segments[segments.length - 1];
  const hasIdSegment = segments.length > moduleSegmentIndex + 1;

  if (lastSegment === "new") {
    requiredAction = "add";
  } else if (
    lastSegment === "edit" &&
    hasIdSegment &&
    segments[moduleSegmentIndex + 1] !== "new"
  ) {
    requiredAction = "edit";
  } else {
    requiredAction = "view";
  }

  return checkPermission(permissions, permissionModule, requiredAction);
}

async function loginWithCredentials(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  try {
    const response = await fetchClient.post<LoginResponse>(
      "/auth/login",
      credentials,
      { returnErrorStatus: true }
    );

    const { user, token } = response.data;

    if (user.status === "pending_verification") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error: any = new Error("Account not verified");
      error.response = { status: 405 };
      throw error;
    } else if (user.status === "deactivated") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error: any = new Error("Account deactivated");
      error.response = { status: 403 };
      throw error;
    }

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
      const userPermissions = auth?.user?.role?.functions;
      const pathname = nextUrl.pathname;

      // Log out if user status is deactivated
      if (auth?.user?.status === "deactivated") {
        return false;
      }

      const isAuthRoute = authRoutes.some((route) =>
        pathname.startsWith(route)
      );

      // Handle auth routes
      if (isAuthRoute) {
        return isLoggedIn ? Response.redirect(new URL("/", nextUrl)) : true;
      }

      // Require login for all other routes
      if (!isLoggedIn) {
        const loginUrl = new URL("/login", nextUrl);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return Response.redirect(loginUrl);
      }

      // Check permissions for the requested path
      const accessResult = hasAccessForPath(pathname, userPermissions, nextUrl);
      if (accessResult === true) {
        return true; // Access granted
      } else if (accessResult instanceof Response) {
        return accessResult; // Redirect to /not-found
      }

      // If no access, redirect to the dedicated unauthorized page
      // Check if already on unauthorized page to prevent self-redirect loop
      if (pathname !== "/unauthorized") {
        return Response.redirect(new URL("/unauthorized", nextUrl));
      }

      // If already on /unauthorized, allow access (avoids potential loop if /unauthorized wasn't public)
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
          const statusCode = error.response?.status || 500;
          const ErrorClass =
            AuthErrorClasses[statusCode] || AuthErrorClasses["500"];
          throw new ErrorClass();
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
