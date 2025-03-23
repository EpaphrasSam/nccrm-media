"use client";

import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { navigationService } from "@/utils/navigation";

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    navigationService.init(router);
  }, [router]);

  return (
    <SessionProvider>
      <HeroUIProvider>
        <ToastProvider placement="top-center" />
        {children}
      </HeroUIProvider>
    </SessionProvider>
  );
}
