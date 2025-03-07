"use client";

import { useEffect } from "react";
import useSWR from "swr";
import { useRolesStore } from "@/store/roles";
import { roleService } from "@/services/roles/api";

interface InitializeRoleProps {
  id: string;
}

export function InitializeRole({ id }: InitializeRoleProps) {
  const { setFormLoading } = useRolesStore();

  // Common SWR config to handle errors
  const swrConfig = {
    onError: (error: Error) => {
      // Error is already handled by clientApiCall
      console.error("SWR Error:", error);
    },
    shouldRetryOnError: false,
  };

  // Fetch role data
  const { isLoading: isRoleLoading } = useSWR(
    `role/${id}`,
    async () => {
      try {
        const response = await roleService.fetchById(id);
        const role = response && "data" in response ? response.data : response;
        useRolesStore.setState({
          currentRole: role?.role || undefined,
        });
        return role;
      } finally {
        if (isRoleLoading) {
          setFormLoading(false);
        }
      }
    },
    swrConfig
  );

  // Update loading states based on SWR's initial loading state
  useEffect(() => {
    if (isRoleLoading) {
      setFormLoading(true);
    }
  }, [isRoleLoading, setFormLoading]);

  return null;
}
