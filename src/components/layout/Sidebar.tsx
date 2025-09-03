"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { routes, bottomRoutes, Route, RouteGroup } from "@/lib/routes";
import { authService } from "@/services/auth/api";
import { useState, useMemo, useEffect, useRef } from "react";
import { Spinner, Skeleton } from "@heroui/react";
import { usePermissions } from "@/hooks/usePermissions";

interface SidebarProps {
  className?: string;
  isDrawer?: boolean;
}

export function Sidebar({ className = "", isDrawer = false }: SidebarProps) {
  const pathname = usePathname();
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
          const permissionModuleKey = route.permissionModule;
          const canView =
            !permissionModuleKey || hasPermission(permissionModuleKey, "view");
          return canView ? route : null;
        }
      })
      .filter(Boolean) as (Route | RouteGroup)[];
  }, [permissionsLoading, isAuthenticated, hasPermission]);

  // Cache last good routes to prevent flicker during transient loading
  const [cachedRoutes, setCachedRoutes] = useState<(Route | RouteGroup)[]>([]);
  const hasInitialRoutes = useRef(false);
  useEffect(() => {
    if (!permissionsLoading && isAuthenticated) {
      hasInitialRoutes.current = true;
      setCachedRoutes(filteredRoutes);
    }
  }, [permissionsLoading, isAuthenticated, filteredRoutes]);

  const SkeletonIcon = () => <Skeleton className="h-5 w-5 rounded-md" />;
  const skeletonMainRoutes = Array.from({ length: 5 }).map((_, i) => ({
    path: `/skeleton-main-${i}`,
    icon: SkeletonIcon,
    label: "skeleton",
  }));
  const skeletonAdminRoutes = Array.from({ length: 5 }).map((_, i) => ({
    path: `/skeleton-admin-${i}`,
    icon: SkeletonIcon,
    label: "skeleton",
  }));
  const skeletonBottomRoutes = Array.from({ length: 2 }).map((_, i) => ({
    path: `/skeleton-bottom-${i}`,
    icon: SkeletonIcon,
    label: "skeleton",
  }));
  const SkeletonLabel = <Skeleton className="h-4 w-20 rounded-md" />;
  const renderRouteWithSkeleton = (route: Route) => {
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
            {route.label === "skeleton" ? SkeletonLabel : route.label}
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
          {route.label === "skeleton" ? SkeletonLabel : route.label}
        </span>
      </Link>
    );
  };

  const effectiveRoutes =
    permissionsLoading && hasInitialRoutes.current && cachedRoutes.length > 0
      ? cachedRoutes
      : filteredRoutes;

  const mainRoutes = effectiveRoutes.filter(
    (route) => !("routes" in route)
  ) as Route[];
  const adminGroup = effectiveRoutes.find((route) => "routes" in route) as
    | RouteGroup
    | undefined;
  // Only show skeletons on first load; during later transient loads use cached routes
  if (permissionsLoading && !hasInitialRoutes.current) {
    return (
      <div
        className={`flex flex-col h-full bg-white border-r ${
          isDrawer ? "w-72" : "w-72 md:w-20 lg:w-72"
        } ${className}`}
      >
        <div className="flex flex-col h-full px-4 py-6 space-y-4">
          <nav className="pt-6 space-y-2">
            {skeletonMainRoutes.map(renderRouteWithSkeleton)}
          </nav>
          <div className="mt-8 flex-1 min-h-0">
            <div className="h-full overflow-y-auto custom-scrollbar">
              <div className="space-y-4">
                <div
                  className={`sticky top-0 bg-white px-6 text-sm-plus font-extrabold text-brand-gray border-b pb-2 ${
                    isDrawer ? "block" : "md:hidden lg:block"
                  }`}
                >
                  <Skeleton className="h-5 w-20" />
                </div>
                <div className="space-y-2">
                  {skeletonAdminRoutes.map(renderRouteWithSkeleton)}
                </div>
              </div>
            </div>
          </div>
          <div className="py-6 mt-auto space-y-2">
            {skeletonBottomRoutes.map(renderRouteWithSkeleton)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col h-full bg-white border-r ${
        isDrawer ? "w-72" : "w-72 md:w-20 lg:w-72"
      } ${className}`}
    >
      <div className="flex flex-col h-full px-4">
        {/* Main Routes */}
        <nav className="pt-6 space-y-2">
          {mainRoutes.map(renderRouteWithSkeleton)}
        </nav>

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
                  {adminGroup.routes.map(renderRouteWithSkeleton)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Routes */}
        <div className="py-6 mt-auto space-y-2">
          {bottomRoutes.map(renderRouteWithSkeleton)}
        </div>
      </div>
    </div>
  );
}
