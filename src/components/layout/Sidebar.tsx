"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { routes, bottomRoutes, Route, RouteGroup } from "@/lib/routes";
import { authService } from "@/services/auth/api";
import { useState } from "react";
import { Spinner, Skeleton } from "@heroui/react";
import { useSession } from "next-auth/react";

interface SidebarProps {
  className?: string;
  isDrawer?: boolean;
}

export function Sidebar({ className = "", isDrawer = false }: SidebarProps) {
  const pathname = usePathname();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: session, status } = useSession();
  // const isAdmin = session?.user?.role?.name === "superadmin";
  const isAdmin = true;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const isRouteActive = (path: string) => pathname === path;

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderRoute = (route: Route) => {
    if (route.action) {
      return (
        <button
          key={route.label}
          onClick={handleLogout}
          className={`flex text-brand-red-dark items-center gap-4 px-6 py-3.5 rounded-md transition-colors text-sm-plus font-extrabold leading-117 hover:bg-red-200 w-full ${
            !isDrawer && "md:justify-center md:px-2 lg:justify-start lg:px-6"
          }`}
          disabled={isLoading}
        >
          <route.icon />
          <span className={isDrawer ? "block" : "md:hidden lg:block"}>
            {route.label}
          </span>
          {isLoading && <Spinner size="sm" color="danger" />}
        </button>
      );
    }

    return (
      <Link
        key={route.path}
        href={route.path!}
        className={`flex items-center gap-4 px-6 py-3.5 rounded-md transition-colors text-sm-plus font-extrabold leading-117 text-brand-black ${
          isRouteActive(route.path!)
            ? "bg-brand-gray-light"
            : "hover:bg-brand-gray-light"
        } ${!isDrawer && "md:justify-center md:px-2 lg:justify-start lg:px-6"}`}
      >
        <route.icon />
        <span className={isDrawer ? "block" : "md:hidden lg:block"}>
          {route.label}
        </span>
      </Link>
    );
  };

  const renderAdminSection = (group: RouteGroup) => {
    if (status === "loading")
      return (
        <div key={group.label} className="space-y-4">
          <div
            className={`sticky top-0 bg-white px-6 text-sm-plus font-extrabold text-brand-gray border-b pb-2 ${
              isDrawer ? "block" : "md:hidden lg:block"
            }`}
          >
            {group.label}
          </div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-3.5">
                <Skeleton className="h-5 w-5 rounded-md" />
                <Skeleton className="h-4 w-32 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      );
    return (
      <div key={group.label} className="space-y-4">
        <div
          className={`sticky top-0 bg-white px-6 text-sm-plus font-extrabold text-brand-gray border-b pb-2 ${
            isDrawer ? "block" : "md:hidden lg:block"
          }`}
        >
          {group.label}
        </div>
        <div className="space-y-2">
          {group.routes.map((route) => renderRoute(route))}
        </div>
      </div>
    );
  };

  const mainRoutes = routes.filter((route) => !("routes" in route));
  const adminGroup = isAdmin
    ? (routes.find((route) => "routes" in route) as RouteGroup)
    : null;

  return (
    <div
      className={`flex flex-col h-full bg-white border-r ${
        isDrawer ? "w-72" : "w-72 md:w-20 lg:w-72"
      } ${className}`}
    >
      <div className="flex flex-col h-full px-4">
        {/* Main Routes */}
        <nav className="pt-6 space-y-2">
          {mainRoutes.map((route) => renderRoute(route as Route))}
        </nav>

        {/* Admin Section - Scrollable */}
        {isAdmin && (
          <div className="mt-8 flex-1 min-h-0">
            <div className="h-full overflow-y-auto custom-scrollbar">
              {adminGroup && renderAdminSection(adminGroup)}
            </div>
          </div>
        )}

        {/* Bottom Routes */}
        <div className="py-6 mt-auto space-y-2">
          {bottomRoutes.map(renderRoute)}
        </div>
      </div>
    </div>
  );
}
