/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { useEffect } from "react";
import { fetchClient, signOutWithSessionClear } from "@/utils/fetch-client";
import type { AuthResponse } from "@/services/auth/types";
import isEqual from "fast-deep-equal";
import { addToast } from "@heroui/toast";
import { useRouter } from "next/navigation";
import { hasAccessForPath } from "./usePermissions";

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
  const router = useRouter();

  const { data: user, mutate } = useSWR(
    session?.user?.id ? `/get-user/${session.user.id}` : null,
    async (url) => {
      try {
        const res = await fetchClient.get(url, { returnErrorStatus: true });
        return (res.data as { user: AuthResponse }).user;
      } catch (err: any) {
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

    // If user is pending verification, sign out immediately
    if (pickedUser && pickedUser.status === "pending_verification") {
      addToast({
        title: "Account not approved",
        description: "Please contact support.",
        color: "danger",
      });
      signOutWithSessionClear();
      return;
    }

    // Check permissions for current route
    if (pickedUser && typeof window !== "undefined") {
      const pathname = window.location.pathname;
      const permissions = pickedUser.role?.functions;
      if (!hasAccessForPath(pathname, permissions)) {
        if (pathname !== "/unauthorized") {
          router.push("/unauthorized");
        }
        return;
      }
    }

    if (
      pickedUser &&
      pickedSessionUser &&
      !isEqual(pickedUser, pickedSessionUser)
    ) {
      update({ user });
    }
  }, [user, session?.user, update, router]);

  return { user, mutate };
}
