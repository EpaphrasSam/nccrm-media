"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import { GhanaFlagGradient } from "@/components/common/overlays/GhanaFlagGradient";

const backgroundImages = {
  "/login": "/images/login-background.png",
  "/signup": "/images/signup-background.png",
  "/forgot-password": "/images/forgot-password-background.png",
} as const;

type ValidPath = keyof typeof backgroundImages;

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() as ValidPath;
  const backgroundImage =
    backgroundImages[pathname] || backgroundImages["/login"];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Background Image Section */}
      <div className="fixed inset-0 lg:sticky lg:w-1/2 lg:h-screen">
        <div className="absolute inset-0">
          <Image
            src={backgroundImage}
            alt="Background"
            fill
            className="object-cover"
            priority
          />
          <GhanaFlagGradient className="z-10" />
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 relative z-20 flex items-center justify-center min-h-screen lg:w-1/2">
        <div className="w-full max-lg:max-w-md max-sm:max-w-sm mx-auto bg-white backdrop-blur-sm p-6 lg:p-8 rounded-lg m-4">
          {children}
        </div>
      </div>
    </div>
  );
}
