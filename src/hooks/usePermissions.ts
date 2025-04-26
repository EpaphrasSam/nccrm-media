"use client";

import { useSession } from "next-auth/react";
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

  const hasPermission = (
    module: PermissionModule,
    action: PermissionAction
  ): boolean => {
    if (isLoading || !isAuthenticated || !permissions) {
      return false;
    }

    const modulePermissions = permissions[module];

    if (!modulePermissions) {
      return false; // Module or its permissions not found
    }

    if (action === "approve") {
      return "approve" in modulePermissions && !!modulePermissions.approve;
    }

    return !!modulePermissions[action as keyof BaseFunctions];
  };

  return {
    hasPermission,
    permissions,
    isLoading,
    isAuthenticated,
  };
}
