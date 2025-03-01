"use client";

import { useState } from "react";
import {
  Navbar as HeroNavbar,
  Avatar,
  Button,
  Drawer,
  DrawerContent,
  Skeleton,
} from "@heroui/react";
import { FiMenu } from "react-icons/fi";
import { Logo } from "@/components/common/misc/Logo";
import { Sidebar } from "./Sidebar";
import { useSession } from "next-auth/react";

interface NavbarProps {
  className?: string;
}

export function Navbar({ className = "" }: NavbarProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { data: session, status } = useSession();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <>
      <HeroNavbar maxWidth="full" isBordered className={`h-16 ${className}`}>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <Button
              isIconOnly
              variant="light"
              className="md:hidden"
              onPress={() => setIsDrawerOpen(true)}
            >
              <FiMenu className="w-5 h-5" />
            </Button>
            <Logo hideTextOnMobile />
          </div>
          <div className="flex items-center gap-3">
            {status === "loading" ? (
              <>
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="space-y-0.5 mt-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </>
            ) : (
              <>
                <Avatar
                  fallback={
                    session?.user?.name ? getInitials(session.user.name) : ""
                  }
                  isBordered
                  size="md"
                  className="cursor-pointer"
                />
                <div className="space-y-0.5 mt-1">
                  <p className="text-sm-plus font-extrabold text-brand-black-dark">
                    {session?.user?.name}
                  </p>
                  <p className="text-xs-plus text-brand-green-dark font-extrabold capitalize">
                    {session?.user?.role?.name}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </HeroNavbar>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        placement="left"
        radius="none"
        className="w-max"
      >
        <DrawerContent>
          <Sidebar isDrawer />
        </DrawerContent>
      </Drawer>
    </>
  );
}
