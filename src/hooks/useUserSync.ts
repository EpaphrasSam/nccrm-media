/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { useEffect } from "react";
import { fetchClient, signOutWithSessionClear } from "@/utils/fetch-client";
import type { AuthResponse } from "@/services/auth/types";
import isEqual from "fast-deep-equal";
import { addToast } from "@heroui/toast";

function pickRelevantUserFields(user: AuthResponse | null | undefined) {
  if (!user) return null;
  const {
    id,
    name,
    email,
    username,
    image,
    phone_number,
    role,
    department,
    gender,
    status,
  } = user;
  return {
    id,
    name,
    email,
    username,
    image,
    phone_number,
    role,
    department,
    gender,
    status,
  };
}

export function useUserSync(pollInterval = 0) {
  const { data: session, update } = useSession();

  const {
    data: user,

    mutate,
  } = useSWR(
    session?.user?.id ? `/get-user/${session.user.id}` : null,
    async (url) => {
      try {
        const res = await fetchClient.get(url, { returnErrorStatus: true });
        return (res.data as { user: AuthResponse }).user;
      } catch (err: any) {
        console.log("Error in useUserSync", err);
        // If backend returns 408, log out
        if (err?.response?.status === 408 || err?.response?.status === 404) {
          addToast({
            title: "Session expired",
            description: "Please log in again.",
            color: "danger",
          });
          signOutWithSessionClear();
        }
        throw err;
      }
    },
    { refreshInterval: pollInterval }
  );

  useEffect(() => {
    const pickedUser = pickRelevantUserFields(user);
    const pickedSessionUser = pickRelevantUserFields(
      session?.user as AuthResponse
    );

    // If user is deactivated, sign out immediately
    if (pickedUser && pickedUser.status === "deactivated") {
      addToast({
        title: "Account deactivated",
        description: "Please contact support.",
        color: "danger",
      });
      signOutWithSessionClear();
      return;
    }

    if (
      pickedUser &&
      pickedSessionUser &&
      !isEqual(pickedUser, pickedSessionUser)
    ) {
      update({ user });
    }
  }, [user, session?.user, update]);

  return { user, mutate };
}
