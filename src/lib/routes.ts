import {
  FiHome,
  FiUsers,
  FiFileText,
  FiSettings,
  FiLogOut,
  FiUserCheck,
  FiGrid,
  FiMap,
  FiFolder,
  FiBarChart2,
  FiTrendingUp,
} from "react-icons/fi";
import { IconType } from "react-icons";

export interface Route {
  label: string;
  path: string;
  icon: IconType;
  requiredRole?: "admin" | "user";
}

export interface RouteGroup {
  label: string;
  requiredRole?: "admin" | "user";
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
  },
  {
    label: "Admin",
    requiredRole: "admin",
    routes: [
      {
        label: "Manage Users",
        path: "/admin/users",
        icon: FiUsers,
        requiredRole: "admin",
      },
      {
        label: "Manage Roles",
        path: "/admin/roles",
        icon: FiUserCheck,
        requiredRole: "admin",
      },
      {
        label: "Manage Departments",
        path: "/admin/departments",
        icon: FiGrid,
        requiredRole: "admin",
      },
      {
        label: "Manage Regions",
        path: "/admin/regions",
        icon: FiMap,
        requiredRole: "admin",
      },
      {
        label: "Manage Thematic Areas",
        path: "/admin/thematic-areas",
        icon: FiFolder,
        requiredRole: "admin",
      },
      {
        label: "Manage Main Indicators",
        path: "/admin/main-indicators",
        icon: FiBarChart2,
        requiredRole: "admin",
      },
      {
        label: "Manage Sub-indicators",
        path: "/admin/sub-indicators",
        icon: FiTrendingUp,
        requiredRole: "admin",
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
    path: "/auth/logout",
    icon: FiLogOut,
  },
];
