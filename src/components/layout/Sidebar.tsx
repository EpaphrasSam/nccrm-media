"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { routes, bottomRoutes, Route, RouteGroup } from "@/lib/routes";
import { authService } from "@/services/auth/api";
import { useState, useMemo } from "react";
import { Spinner, Skeleton } from "@heroui/react";
import { usePermissions } from "@/hooks/usePermissions";

interface SidebarProps {
  className?: string;
  isDrawer?: boolean;
}

export function Sidebar({ className = "", isDrawer = false }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Use the permissions hook
  const {
    hasPermission,
    isLoading: permissionsLoading,
    isAuthenticated,
  } = usePermissions();

  const isRouteActive = (path: string) => pathname === path;

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await authService.logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Filter routes based on permissions using route.permissionModule
  const filteredRoutes = useMemo(() => {
    if (permissionsLoading || !isAuthenticated) {
      return [];
    }
    return routes
      .map((route) => {
        if ("routes" in route) {
          // RouteGroup
          const filteredSubRoutes = route.routes.filter((subRoute) => {
            const permissionModuleKey = subRoute.permissionModule;
            return (
              !permissionModuleKey || hasPermission(permissionModuleKey, "view")
            );
          });
          return filteredSubRoutes.length > 0
            ? { ...route, routes: filteredSubRoutes }
            : null;
        } else {
          // Single Route
          const permissionModuleKey = route.permissionModule;
          // Corrected: Return route if allowed, otherwise null
          const canView =
            !permissionModuleKey || hasPermission(permissionModuleKey, "view");
          return canView ? route : null;
        }
      })
      .filter(Boolean) as (Route | RouteGroup)[]; // filter(Boolean) now correctly removes only nulls
  }, [permissionsLoading, isAuthenticated, hasPermission]);

  const renderRoute = (route: Route) => {
    if (route.action) {
      return (
        <button
          key={route.label}
          onClick={handleLogout}
          className={`flex text-brand-red-dark items-center gap-4 px-6 py-3.5 rounded-md transition-colors text-sm-plus font-extrabold leading-117 hover:bg-red-200 w-full ${
            !isDrawer && "md:justify-center md:px-2 lg:justify-start lg:px-6"
          }`}
          disabled={isLoggingOut}
        >
          <route.icon />
          <span className={isDrawer ? "block" : "md:hidden lg:block"}>
            {route.label}
          </span>
          {isLoggingOut && <Spinner size="sm" color="danger" />}
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

  const mainRoutes = filteredRoutes.filter(
    (route) => !("routes" in route)
  ) as Route[];
  const adminGroup = filteredRoutes.find((route) => "routes" in route) as
    | RouteGroup
    | undefined;

  if (permissionsLoading) {
    return (
      <div
        className={`flex flex-col h-full bg-white border-r ${
          isDrawer ? "w-72" : "w-72 md:w-20 lg:w-72"
        } ${className}`}
      >
        <div className="flex flex-col h-full px-4 py-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={`skel-main-${i}`}
              className="flex items-center gap-4 px-6 py-3.5"
            >
              <Skeleton className="h-5 w-5 rounded-md" />
              <Skeleton className="h-4 w-32 rounded-md" />
            </div>
          ))}
          <div className="mt-8 flex-1 min-h-0 space-y-4">
            <Skeleton className="h-5 w-20 px-6 mb-2" />
            {[...Array(5)].map((_, i) => (
              <div
                key={`skel-admin-${i}`}
                className="flex items-center gap-4 px-6 py-3.5"
              >
                <Skeleton className="h-5 w-5 rounded-md" />
                <Skeleton className="h-4 w-32 rounded-md" />
              </div>
            ))}
          </div>
          <div className="mt-auto space-y-2">
            {[...Array(2)].map((_, i) => (
              <div
                key={`skel-bottom-${i}`}
                className="flex items-center gap-4 px-6 py-3.5"
              >
                <Skeleton className="h-5 w-5 rounded-md" />
                <Skeleton className="h-4 w-32 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (pathname === "/unauthorized") {
    return null;
  }

  return (
    <div
      className={`flex flex-col h-full bg-white border-r ${
        isDrawer ? "w-72" : "w-72 md:w-20 lg:w-72"
      } ${className}`}
    >
      <div className="flex flex-col h-full px-4">
        {/* Main Routes */}
        <nav className="pt-6 space-y-2">{mainRoutes.map(renderRoute)}</nav>

        {/* Admin Section - Scrollable */}
        {adminGroup && (
          <div className="mt-8 flex-1 min-h-0">
            <div className="h-full overflow-y-auto custom-scrollbar">
              <div key={adminGroup.label} className="space-y-4">
                <div
                  className={`sticky top-0 bg-white px-6 text-sm-plus font-extrabold text-brand-gray border-b pb-2 ${
                    isDrawer ? "block" : "md:hidden lg:block"
                  }`}
                >
                  {adminGroup.label}
                </div>
                <div className="space-y-2">
                  {adminGroup.routes.map(renderRoute)}
                </div>
              </div>
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
