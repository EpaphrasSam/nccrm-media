"use client";

import { useCallback } from "react";
import { useUsersStore } from "@/store/users";
import { InitializeStore } from "@/components/common/misc/InitializeStore";
import { fetchUsers } from "@/services/users/api";
import { fetchDepartments } from "@/services/departments/api";
import { fetchRoles } from "@/services/roles/api";
import { User } from "@/services/users/types";

export function InitializeUsers() {
  const initializeUsers = useCallback(async () => {
    useUsersStore.setState({ isLoading: true });

    try {
      const [users, departments, roles] = await Promise.all([
        fetchUsers(),
        fetchDepartments(),
        fetchRoles(),
      ]);

      // Add department and role names to users
      const usersWithDetails: User[] = users.map((user) => {
        const department = departments.find(
          (dept) => dept.id === user.departmentId
        );
        const role = roles.find((r) => r.id === user.roleId);
        return {
          ...user,
          department: department?.name || "Unknown",
          role: role?.name || "Unknown",
        };
      });

      useUsersStore.setState({
        users: usersWithDetails,
        filteredUsers: usersWithDetails,
        totalUsers: usersWithDetails.length,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to fetch users:", error);
      useUsersStore.setState({
        isLoading: false,
        users: [],
        filteredUsers: [],
        totalUsers: 0,
      });
    }
  }, []);

  return <InitializeStore onInitialize={initializeUsers} />;
}
