"use client";

import { useEffect } from "react";
import { addToast } from "@heroui/react";

export function ErrorBoundary({ error }: { error?: string | null }) {
  useEffect(() => {
    if (error) {
      addToast({
        title: "Error",
        description: error,
        color: "danger",
      });
    }
  }, [error]);

  return null;
}
