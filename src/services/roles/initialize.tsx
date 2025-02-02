"use client";

import { useCallback } from "react";
import { useRolesStore } from "@/store/roles";
import { InitializeStore } from "@/components/modules/admin/layout/InitializeStore";
import { fetchRoles } from "./api";

export function InitializeRoles() {
  const initializeRoles = useCallback(async () => {
    useRolesStore.setState({ isLoading: true });

    try {
      const roles = await fetchRoles();

      useRolesStore.setState({
        roles,
        filteredRoles: roles,
        totalRoles: roles.length,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to fetch roles:", error);
      useRolesStore.setState({
        isLoading: false,
        roles: [],
        filteredRoles: [],
        totalRoles: 0,
      });
    }
  }, []);

  return <InitializeStore onInitialize={initializeRoles} />;
}
