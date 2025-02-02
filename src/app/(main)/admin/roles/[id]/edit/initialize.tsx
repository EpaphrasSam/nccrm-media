"use client";

import { useCallback } from "react";
import { useRolesStore } from "@/store/roles";
import { InitializeStore } from "@/components/modules/admin/layout/InitializeStore";
import { fetchRoleById } from "@/services/roles/api";

interface InitializeRoleEditProps {
  roleId: string;
}

export function InitializeRoleEdit({ roleId }: InitializeRoleEditProps) {
  const initializeRole = useCallback(async () => {
    useRolesStore.setState({ isLoading: true });

    try {
      const role = await fetchRoleById(roleId);
      if (!role) throw new Error("Role not found");

      useRolesStore.setState({
        currentRole: role,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to fetch role:", error);
      useRolesStore.setState({
        isLoading: false,
        currentRole: undefined,
      });
    }
  }, [roleId]);

  return <InitializeStore onInitialize={initializeRole} />;
}
