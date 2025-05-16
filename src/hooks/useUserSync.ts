"use client";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { useEffect } from "react";
import { fetchClient } from "@/utils/fetch-client";
import type { AuthResponse } from "@/services/auth/types";
import isEqual from "fast-deep-equal";

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

  const { data: user, mutate } = useSWR(
    session?.user?.id ? `/get-user/${session.user.id}` : null,
    (url) =>
      fetchClient
        .get(url)
        .then((res) => (res.data as { user: AuthResponse }).user),
    { refreshInterval: pollInterval }
  );

  useEffect(() => {
    const pickedUser = pickRelevantUserFields(user);
    const pickedSessionUser = pickRelevantUserFields(
      session?.user as AuthResponse
    );
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
