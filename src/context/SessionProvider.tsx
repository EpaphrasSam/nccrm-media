/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { userService } from "@/services/users/api";
import type { Session } from "next-auth";
import type { AuthResponse } from "@/services/auth/types";
import { unstable_update } from "@/utils/auth";

interface SessionContextProps {
  session: Session | null;
  status: "loading" | "authenticated" | "unauthenticated";
}

const SessionContext = createContext<SessionContextProps | undefined>(
  undefined
);

const POLLING_INTERVAL = 300000;

const getUserRelevantData = (user: AuthResponse | null | undefined) => {
  if (!user) return null;
  const { token, ...relevantData } = user;
  return JSON.stringify(relevantData);
};

export function SessionProvider({ children }: { children: ReactNode }) {
  const { data: session, status, update } = useSession();

  const { data: freshUserData } = useSWR<AuthResponse | null>(
    status === "authenticated" ? "currentUser" : null,
    () => userService.fetchCurrentUser(),
    {
      refreshInterval: POLLING_INTERVAL,
      dedupingInterval: POLLING_INTERVAL,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      onError: (err) => {
        console.error("SWR error fetching current user:", err);
      },
    }
  );

  useEffect(() => {
    if (freshUserData && session?.user && status === "authenticated") {
      const currentRelevantDataString = getUserRelevantData(session.user);
      const freshRelevantDataString = getUserRelevantData(freshUserData);

      if (
        currentRelevantDataString &&
        freshRelevantDataString &&
        currentRelevantDataString !== freshRelevantDataString
      ) {
        console.log(
          "Session data changed based on poll, calling unstable_update..."
        );
        update({ user: freshUserData });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [freshUserData, session, status]);

  const contextValue = {
    session,
    status,
  };

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSessionContext() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSessionContext must be used within a SessionProvider");
  }
  return context;
}
