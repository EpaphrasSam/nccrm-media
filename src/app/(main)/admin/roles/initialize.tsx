"use client";

import { useEffect } from "react";
import useSWR from "swr";
import { useRolesStore } from "@/store/roles";
import { roleService } from "@/services/roles/api";
import type { RoleQueryParams } from "@/services/roles/types";
import { urlSync } from "@/utils/url-sync";
import { storeSync } from "@/lib/store-sync";

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
  const { isLoading: isRolesLoading, mutate } = useSWR(
    ["roles", filters],
    async () => {
      try {
        const response = await roleService.fetchAll(filters);
        const data = "data" in response ? response.data : response;

        useRolesStore.setState({
          roles: data.roles,
          totalRoles: data.totalRoles,
          totalPages: data.totalPages,
        });

        return data;
      } finally {
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

  // Subscribe to store sync
  useEffect(() => {
    const unsubscribe = storeSync.subscribe(() => {
      mutate();
    });

    return () => {
      unsubscribe();
    };
  }, [mutate]);

  // Update loading state based on SWR's initial loading state
  useEffect(() => {
    if (isRolesLoading) {
      setTableLoading(true);
    }
  }, [isRolesLoading, setTableLoading]);

  return null;
}
