"use client";

import { useEffect } from "react";
import useSWR from "swr";
import { useRolesStore } from "@/store/roles";
import { roleService } from "@/services/roles/api";
import type { RoleQueryParams, RoleListResponse } from "@/services/roles/types";
import type { ApiResponse } from "@/utils/api-wrapper";
import { urlSync } from "@/utils/url-sync";

interface InitializeRolesProps {
  initialFilters: Partial<RoleQueryParams>;
}

const DEFAULT_FILTERS: RoleQueryParams = {
  page: 1,
  limit: 10,
};

export function InitializeRoles({ initialFilters }: InitializeRolesProps) {
  const { filters, setFilters, setTableLoading } = useRolesStore();

  // Set initial filters from URL or defaults
  useEffect(() => {
    const hasInitialFilters = Object.keys(initialFilters).length > 0;
    if (hasInitialFilters) {
      setFilters(initialFilters);
    } else {
      // If no URL params exist, set defaults and push to URL
      setFilters(DEFAULT_FILTERS);
      urlSync.pushToUrl(DEFAULT_FILTERS);
    }
  }, [initialFilters, setFilters]);

  // Common SWR config to handle errors
  const swrConfig = {
    onError: (error: Error) => {
      // Error is already handled by clientApiCall
      console.error("SWR Error:", error);
    },
    shouldRetryOnError: false, // Disable automatic retries
  };

  // Fetch roles data - will refetch when filters change
  const { isLoading: isRolesLoading } = useSWR(
    ["roles", filters],
    async () => {
      try {
        const response = (await roleService.fetchAll(
          filters,
          true
        )) as ApiResponse<RoleListResponse>;
        if (response.data) {
          useRolesStore.setState({
            roles: response.data.roles,
            totalRoles: response.data.totalRoles,
            totalPages: response.data.totalPages,
          });
        }
        return response.data;
      } finally {
        // Only update loading state after initial load
        if (isRolesLoading) {
          setTableLoading(false);
        }
      }
    },
    {
      ...swrConfig,
      keepPreviousData: true,
    }
  );

  // Update loading states based on SWR's initial loading state
  useEffect(() => {
    if (isRolesLoading) {
      setTableLoading(true);
    }
  }, [isRolesLoading, setTableLoading]);

  return null;
}
