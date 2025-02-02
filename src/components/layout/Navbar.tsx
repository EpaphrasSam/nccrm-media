"use client";

import { useState } from "react";
import {
  Navbar as HeroNavbar,
  Avatar,
  Button,
  Drawer,
  DrawerContent,
} from "@heroui/react";
import { FiMenu } from "react-icons/fi";
import { Logo } from "@/components/common/misc/Logo";
import { Sidebar } from "./Sidebar";

interface User {
  name: string;
  role: "admin" | "user";
  initials: string;
}

interface NavbarProps {
  className?: string;
}

export function Navbar({ className = "" }: NavbarProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // This will later come from your auth context/store
  const user: User = {
    name: "Sarah Ibrahim",
    role: "admin",
    initials: "SI",
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
            <Logo hideTextOnMobile/>
          </div>
          <div className="flex items-center gap-3">
            <Avatar
              fallback={user.initials}
              isBordered
              size="md"
              className="cursor-pointer"
            />
            <div className="space-y-0.5 mt-1">
              <p className="text-sm-plus font-extrabold text-brand-black-dark">
                {user.name}
              </p>
              <p className="text-xs-plus text-brand-green-dark font-extrabold capitalize">
                {user.role}
              </p>
            </div>
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
