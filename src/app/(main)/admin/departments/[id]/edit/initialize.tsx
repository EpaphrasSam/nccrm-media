"use client";

import { useCallback } from "react";
import { useDepartmentsStore } from "@/store/departments";
import { InitializeStore } from "@/components/modules/admin/layout/InitializeStore";
import { fetchDepartmentById } from "@/services/departments/api";

export function InitializeDepartment({ id }: { id: string }) {
  const initializeDepartment = useCallback(async () => {
    useDepartmentsStore.setState({ isLoading: true });

    try {
      const department = await fetchDepartmentById(id);
      if (!department) throw new Error("Department not found");

      useDepartmentsStore.setState({
        currentDepartment: department,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to fetch department:", error);
      useDepartmentsStore.setState({
        currentDepartment: undefined,
        isLoading: false,
      });
    }
  }, [id]);

  return <InitializeStore onInitialize={initializeDepartment} />;
}
