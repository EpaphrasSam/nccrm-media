"use client";
import { useUserSync } from "@/hooks/useUserSync";
import { useIdleLogout } from "@/hooks/useIdleLogout";
import React from "react";

export function UserSyncPoller({ children }: { children: React.ReactNode }) {
  useUserSync(60000); // Poll every 60 seconds
  useIdleLogout();
  return <>{children}</>;
}
