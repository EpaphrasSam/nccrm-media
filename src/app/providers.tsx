"use client";

import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { navigationService } from "@/utils/navigation";
import { PublicEnvScript } from "next-runtime-env";

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    navigationService.init(router);
  }, [router]);

  return (
    <SessionProvider>
      <HeroUIProvider>
        <PublicEnvScript />
        <ToastProvider placement="top-center" />
        {children}
      </HeroUIProvider>
    </SessionProvider>
  );
}
