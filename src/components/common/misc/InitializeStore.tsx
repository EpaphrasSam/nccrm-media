"use client";

import { useEffect } from "react";

interface InitializeStoreProps {
  onInitialize: () => Promise<void>;
}

export function InitializeStore({ onInitialize }: InitializeStoreProps) {
  useEffect(() => {
    onInitialize();
  }, [onInitialize]);

  return null;
}
