"use client";

import { useCallback } from "react";
import { useUsersStore } from "@/store/users";
import { InitializeStore } from "@/components/common/misc/InitializeStore";
import { fetchUserById } from "@/services/users/api";
import { fetchDepartments } from "@/services/departments/api";
import { fetchRoles } from "@/services/roles/api";

export function InitializeUser({ id }: { id: string }) {
  const initializeUser = useCallback(async () => {
    useUsersStore.setState({ isLoading: true });

    try {
      const [user, departments, roles] = await Promise.all([
        fetchUserById(id),
        fetchDepartments(),
        fetchRoles(),
      ]);

      if (!user) throw new Error("User not found");

      // Add department and role names to user
      const department = departments.find(
        (dept) => dept.id === user.departmentId
      );
      const role = roles.find((r) => r.id === user.roleId);
      const userWithDetails = {
        ...user,
        department: department?.name || "Unknown",
        role: role?.name || "Unknown",
      };

      useUsersStore.setState({
        currentUser: userWithDetails,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to fetch user:", error);
      useUsersStore.setState({
        currentUser: undefined,
        isLoading: false,
      });
    }
  }, [id]);

  return <InitializeStore onInitialize={initializeUser} />;
}
