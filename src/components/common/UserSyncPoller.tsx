"use client";
import { useUserSync } from "@/hooks/useUserSync";
import React from "react";

export function UserSyncPoller({ children }: { children: React.ReactNode }) {
  useUserSync(60000); // Poll every 60 seconds
  return <>{children}</>;
}
