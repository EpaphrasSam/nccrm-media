"use client";

import { useEffect } from "react";
import useSWR from "swr";
import { useUsersStore } from "@/store/users";
import { userService } from "@/services/users/api";
import { departmentService } from "@/services/departments/api";
import { roleService } from "@/services/roles/api";
import type { UserQueryParams } from "@/services/users/types";
import { urlSync } from "@/utils/url-sync";

interface InitializeUsersProps {
  initialFilters: Partial<UserQueryParams>;
}

const DEFAULT_FILTERS: UserQueryParams = {
  page: 1,
  limit: 10,
};

export function InitializeUsers({ initialFilters }: InitializeUsersProps) {
  const { filters, setFilters, setTableLoading, setFiltersLoading } =
    useUsersStore();

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

  // Fetch users data - will refetch when filters change
  const { isLoading: isUsersLoading } = useSWR(
    ["users", filters],
    async () => {
      try {
        const response = await userService.fetchAll(filters);
        const data = "data" in response ? response.data : response;

        useUsersStore.setState({
          users: data.users,
          totalUsers: data.totalUsers,
          totalPages: data.totalPages,
        });

        return data;
      } finally {
        // Only update loading state after initial load
        if (isUsersLoading) {
          setTableLoading(false);
        }
      }
    },
    {
      ...swrConfig,
      keepPreviousData: true,
    }
  );

  // Fetch filter options (departments and roles)
  const { isLoading: isFilterOptionsLoading } = useSWR(
    "filterOptions",
    async () => {
      try {
        const [departmentsResponse, rolesResponse] = await Promise.all([
          departmentService.fetchAll(undefined),
          roleService.fetchAll(undefined),
        ]);

        const departments =
          "data" in departmentsResponse
            ? departmentsResponse.data.departments
            : departmentsResponse.departments;

        const roles =
          "data" in rolesResponse
            ? rolesResponse.data.roles
            : rolesResponse.roles;

        // Set departments and roles in the store
        useUsersStore.setState({
          departments,
          roles,
        });

        return {
          departments,
          roles,
        };
      } finally {
        // Only update loading state after initial load
        if (isFilterOptionsLoading) {
          setFiltersLoading(false);
        }
      }
    },
    swrConfig
  );

  // Update loading states based on SWR's initial loading state
  useEffect(() => {
    if (isFilterOptionsLoading) {
      setFiltersLoading(true);
    }
  }, [isFilterOptionsLoading, setFiltersLoading]);

  useEffect(() => {
    if (isUsersLoading) {
      setTableLoading(true);
    }
  }, [isUsersLoading, setTableLoading]);

  return null;
}
