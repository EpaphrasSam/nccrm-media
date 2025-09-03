"use client";

import { useSession } from "next-auth/react";
import { useCallback } from "react";
import type { RolePermissions, BaseFunctions } from "@/services/roles/types";

type PermissionModule = keyof RolePermissions;
type PermissionAction = keyof BaseFunctions | "approve";

interface UsePermissionsReturn {
  hasPermission: (
    module: PermissionModule,
    action: PermissionAction
  ) => boolean;

  permissions: RolePermissions | null | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function usePermissions(): UsePermissionsReturn {
  const { data: session, status } = useSession();

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";
  const permissions = session?.user?.role?.functions;

  const hasPermission = useCallback(
    (module: PermissionModule, action: PermissionAction): boolean => {
      if (isLoading || !isAuthenticated || !permissions) {
        return false;
      }

      const modulePermissions = permissions[module];

      if (!modulePermissions) {
        return false;
      }

      if (action === "approve") {
        return "approve" in modulePermissions && !!modulePermissions.approve;
      }

      return !!modulePermissions[action as keyof BaseFunctions];
    },
    [isLoading, isAuthenticated, permissions]
  );

  return {
    hasPermission,
    permissions,
    isLoading,
    isAuthenticated,
  };
}

export const publicRoutes = ["/", "/settings", "/unauthorized", "/not-found"];
export const moduleMap: Record<string, PermissionModule | undefined> = {
  users: "user",
  roles: "role",
  departments: "department",
  "thematic-areas": "thematic_area",
  "main-indicators": "main_indicator",
  "sub-indicators": "sub_indicator",
  events: "event",
};

export function checkPermission(
  permissions: RolePermissions | null | undefined,
  module: PermissionModule,
  action: PermissionAction
): boolean {
  return !!permissions?.[module]?.[action as keyof BaseFunctions];
}

export function hasAccessForPath(
  pathname: string,
  permissions: RolePermissions | null | undefined
): boolean {
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
