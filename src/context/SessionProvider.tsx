/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { createContext, useContext, useEffect } from "react";
import type { Session } from "next-auth";
import type { AuthResponse } from "@/services/auth/types";
import { useSession, signOut } from "next-auth/react";

interface SessionContextProps {
  session: Session | null;
  user: AuthResponse | null | undefined;
}

const SessionContext = createContext<SessionContextProps | undefined>(
  undefined
);

export function SessionProvider({
  children,
  session,
  user,
}: {
  children: React.ReactNode;
  session: Session | null;
  user: AuthResponse | null | undefined;
}) {
  const { update } = useSession();

  useEffect(() => {
    if (session?.user && user) {
      update({ user });
    }
    if (session?.user && user === null) {
      signOut();
    }
  }, [session, user]);

  return (
    <SessionContext.Provider value={{ session, user }}>
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
