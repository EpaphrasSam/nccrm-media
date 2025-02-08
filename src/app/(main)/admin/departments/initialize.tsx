"use client";

import { useCallback } from "react";
import { useDepartmentsStore } from "@/store/departments";
import { InitializeStore } from "@/components/common/misc/InitializeStore";
import { fetchDepartments } from "../../../../services/departments/api";

export function InitializeDepartments() {
  const initializeDepartments = useCallback(async () => {
    useDepartmentsStore.setState({ isLoading: true });

    try {
      const departments = await fetchDepartments();

      useDepartmentsStore.setState({
        departments,
        filteredDepartments: departments,
        totalDepartments: departments.length,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to fetch departments:", error);
      useDepartmentsStore.setState({
        isLoading: false,
        departments: [],
        filteredDepartments: [],
        totalDepartments: 0,
      });
    }
  }, []);

  return <InitializeStore onInitialize={initializeDepartments} />;
}
