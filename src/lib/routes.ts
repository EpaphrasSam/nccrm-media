import {
  FiHome,
  FiUsers,
  FiFileText,
  FiSettings,
  FiLogOut,
  FiUserCheck,
  FiGrid,
  FiFolder,
  FiBarChart2,
  FiTrendingUp,
} from "react-icons/fi";
import { IconType } from "react-icons";
import { TbReportAnalytics } from "react-icons/tb";
import type { RolePermissions } from "@/services/roles/types";

type PermissionModule = keyof RolePermissions;

export interface Route {
  label: string;
  path?: string;
  icon: IconType;
  permissionModule?: PermissionModule;
  action?: () => void;
}

export interface RouteGroup {
  label: string;
  permissionModule?: PermissionModule;
  routes: Route[];
}

export type RouteConfig = (Route | RouteGroup)[];

export const routes: RouteConfig = [
  {
    label: "Dashboard",
    path: "/",
    icon: FiHome,
  },
  {
    label: "Events",
    path: "/events",
    icon: FiFileText,
    permissionModule: "event",
  },
  {
    label: "Situational Reporting",
    path: "/situational-reporting",
    icon: TbReportAnalytics,
    permissionModule: "situational_report",
  },
  {
    label: "Admin",
    routes: [
      {
        label: "Manage Users",
        path: "/admin/users",
        icon: FiUsers,
        permissionModule: "user",
      },
      {
        label: "Manage Roles",
        path: "/admin/roles",
        icon: FiUserCheck,
        permissionModule: "role",
      },
      {
        label: "Manage Departments",
        path: "/admin/departments",
        icon: FiGrid,
        permissionModule: "department",
      },
      {
        label: "Manage Thematic Areas",
        path: "/admin/thematic-areas",
        icon: FiFolder,
        permissionModule: "thematic_area",
      },
      {
        label: "Manage Main Indicators",
        path: "/admin/main-indicators",
        icon: FiBarChart2,
        permissionModule: "main_indicator",
      },
      {
        label: "Manage Sub-indicators",
        path: "/admin/sub-indicators",
        icon: FiTrendingUp,
        permissionModule: "sub_indicator",
      },
    ],
  },
];

export const bottomRoutes: Route[] = [
  {
    label: "Settings",
    path: "/settings",
    icon: FiSettings,
  },
  {
    label: "Logout",
    icon: FiLogOut,
    action: () => true,
  },
];
