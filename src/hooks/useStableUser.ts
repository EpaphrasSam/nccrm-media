"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import type { AuthResponse } from "@/services/auth/types";

export function useStableUser(): {
  user: AuthResponse | null;
  isInitialLoading: boolean;
} {
  const { data: session, status } = useSession();
  const lastUserRef = useRef<AuthResponse | null>(session?.user ?? null);

  useEffect(() => {
    if (session?.user) {
      lastUserRef.current = session.user as AuthResponse;
    }
  }, [session?.user]);

  const isInitialLoading = status === "loading" && !lastUserRef.current;
  const user = (session?.user as AuthResponse) ?? lastUserRef.current;

  return { user: user ?? null, isInitialLoading };
}
