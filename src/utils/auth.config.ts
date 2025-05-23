import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { AuthResponse } from "@/services/auth/types";
import { RolePermissions, BaseFunctions } from "@/services/roles/types";

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

      if (auth?.user?.status === "deactivated") {
        return false;
      }

      const isAuthRoute = authRoutes.some((route) =>
        pathname.startsWith(route)
      );

      if (isAuthRoute) {
        return isLoggedIn ? Response.redirect(new URL("/", nextUrl)) : true;
      }

      if (!isLoggedIn) {
        const loginUrl = new URL("/login", nextUrl);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return Response.redirect(loginUrl);
      }

      const accessResult = hasAccessForPath(pathname, userPermissions, nextUrl);
      if (accessResult === true) {
        return true;
      } else if (accessResult instanceof Response) {
        return accessResult;
      }

      if (pathname !== "/unauthorized") {
        return Response.redirect(new URL("/unauthorized", nextUrl));
      }

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
        if (
          !credentials?.email ||
          !(credentials as Record<string, unknown>).token
        )
          return null;

        // Parse nested fields if they are strings
        const creds = credentials as Record<string, unknown>;
        let role = creds.role;
        let department = creds.department;
        try {
          if (typeof role === "string") role = JSON.parse(role);
          if (typeof department === "string")
            department = JSON.parse(department);
        } catch {}

        return {
          ...credentials,
          role,
          department,
        } as AuthResponse & { token: string };
      },
    }),
  ],
} satisfies NextAuthConfig;
