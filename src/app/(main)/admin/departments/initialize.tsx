"use client";

import { useEffect } from "react";
import useSWR from "swr";
import { useDepartmentsStore } from "@/store/departments";
import { departmentService } from "@/services/departments/api";
import type { DepartmentQueryParams } from "@/services/departments/types";
import { urlSync } from "@/utils/url-sync";

interface InitializeDepartmentsProps {
  initialFilters: Partial<DepartmentQueryParams>;
}

const DEFAULT_FILTERS: DepartmentQueryParams = {
  page: 1,
  limit: 10,
};

export function InitializeDepartments({
  initialFilters,
}: InitializeDepartmentsProps) {
  const { filters, setFilters, setTableLoading } = useDepartmentsStore();

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

  // Fetch departments data - will refetch when filters change
  const { isLoading: isDepartmentsLoading } = useSWR(
    ["departments", filters],
    async () => {
      try {
        const response = await departmentService.fetchAll(filters);
        const data = "data" in response ? response.data : response;

        useDepartmentsStore.setState({
          departments: data.departments,
          totalDepartments: data.totalDepartments,
          totalPages: data.totalPages,
        });

        return data;
      } finally {
        // Only update loading state after initial load
        if (isDepartmentsLoading) {
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
    if (isDepartmentsLoading) {
      setTableLoading(true);
    }
  }, [isDepartmentsLoading, setTableLoading]);

  return null;
}
