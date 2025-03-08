"use client";

import { useUsersStore } from "@/store/users";
import useSWR from "swr";
import { userService } from "@/services/users/api";

interface InitializeUserProps {
  id: string;
}

export function InitializeUser({ id }: InitializeUserProps) {
  const { setFormLoading } = useUsersStore();

  // Common SWR config to handle errors
  const swrConfig = {
    onError: (error: Error) => {
      // Error is already handled by clientApiCall
      console.error("SWR Error:", error);
    },
    shouldRetryOnError: false,
  };

  // Fetch user data
  const { isLoading: isUserLoading } = useSWR(
    `user/${id}`,
    async () => {
      try {
        const response = await userService.fetchById(id);
        const user = response && "data" in response ? response.data : response;
        useUsersStore.setState({ currentUser: user || undefined });
        return user;
      } finally {
        if (isUserLoading) {
          setFormLoading(false);
        }
      }
    },
    swrConfig
  );

  return null;
}
