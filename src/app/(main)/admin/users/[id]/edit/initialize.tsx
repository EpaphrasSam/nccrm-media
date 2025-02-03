"use client";

import { useCallback } from "react";
import { useUsersStore } from "@/store/users";
import { InitializeStore } from "@/components/modules/admin/layout/InitializeStore";
import { fetchUserById } from "@/services/users/api";

export function InitializeUser({ id }: { id: string }) {
  const initializeUser = useCallback(async () => {
    useUsersStore.setState({ isLoading: true });

    try {
      const user = await fetchUserById(id);
      if (!user) throw new Error("User not found");

      useUsersStore.setState({
        currentUser: user,
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
