"use client";

import { useCallback } from "react";
import { useUsersStore } from "@/store/users";
import { InitializeStore } from "@/components/modules/admin/layout/InitializeStore";
import { fetchUsers } from "./api";

export function InitializeUsers() {
  const initializeUsers = useCallback(async () => {
    useUsersStore.setState({ isLoading: true });

    try {
      const users = await fetchUsers();

      useUsersStore.setState({
        users,
        filteredUsers: users,
        totalUsers: users.length,
        filters: {
          department: "all",
          role: "all",
        },
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
