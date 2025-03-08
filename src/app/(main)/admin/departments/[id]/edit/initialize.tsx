"use client";

import { useEffect } from "react";
import useSWR from "swr";
import { useDepartmentsStore } from "@/store/departments";
import { departmentService } from "@/services/departments/api";

interface InitializeDepartmentProps {
  id: string;
}

export function InitializeDepartment({ id }: InitializeDepartmentProps) {
  const { setFormLoading } = useDepartmentsStore();

  // Common SWR config to handle errors
  const swrConfig = {
    onError: (error: Error) => {
      // Error is already handled by clientApiCall
      console.error("SWR Error:", error);
    },
    shouldRetryOnError: false,
  };

  // Fetch department data
  const { isLoading: isDepartmentLoading } = useSWR(
    `department/${id}`,
    async () => {
      try {
        const response = await departmentService.fetchById(id);
        const department =
          response && "data" in response ? response.data : response;

        useDepartmentsStore.setState({
          currentDepartment: department || undefined,
        });
        return department;
      } finally {
        if (isDepartmentLoading) {
          setFormLoading(false);
        }
      }
    },
    swrConfig
  );

  // Update loading states based on SWR's initial loading state
  useEffect(() => {
    if (isDepartmentLoading) {
      setFormLoading(true);
    }
  }, [isDepartmentLoading, setFormLoading]);

  return null;
}
